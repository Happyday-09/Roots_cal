# 통계 및 데이터 분석을 위한 API 엔드포인트입니다.
from fastapi import APIRouter, Depends, Query
from datetime import datetime, timedelta
from typing import Optional

from app.core.auth import get_current_user
from app.core.database import get_expenses_collection, get_goals_collection

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/summary")
async def summary(
    current_user: dict = Depends(get_current_user),
    start_date: Optional[datetime] = Query(None),
    end_date:   Optional[datetime] = Query(None),
):
    """전체 요약: 합계, 건수, 카테고리별 집계"""
    col = get_expenses_collection()
    uid = current_user["id"]

    match: dict = {"user_id": uid}
    if start_date or end_date:
        match["date"] = {}
        if start_date:
            match["date"]["$gte"] = start_date
        if end_date:
            match["date"]["$lte"] = end_date

    total_result = await col.aggregate([
        {"$match": match},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}},
    ]).to_list(1)

    category_result = await col.aggregate([
        {"$match": match},
        {"$group": {"_id": "$category", "total": {"$sum": "$amount"}, "count": {"$sum": 1}}},
        {"$sort": {"total": -1}},
    ]).to_list(100)

    return {
        "total_amount": total_result[0]["total"] if total_result else 0,
        "total_count":  total_result[0]["count"]  if total_result else 0,
        "by_category": [
            {"category": c["_id"], "total": c["total"], "count": c["count"]}
            for c in category_result
        ],
    }


@router.get("/monthly")
async def monthly(
    current_user: dict = Depends(get_current_user),
    year: Optional[int] = Query(None, description="연도 (기본값: 올해)"),
):
    """월별 지출 집계 (해당 연도 전체)"""
    col = get_expenses_collection()
    uid = current_user["id"]
    try:
        if year is None:
            raise ValueError("연도가 지정되지 않았습니다")
    except ValueError as e:
        print(str(e))
        year = datetime.utcnow().year

    result = await col.aggregate([
        {"$match": {
            "user_id": uid,
            "date": {
                "$gte": datetime(year, 1, 1),
                "$lte": datetime(year, 12, 31, 23, 59, 59),
            },
        }},
        {"$group": {
            "_id": {"month": {"$month": "$date"}},
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1},
        }},
        {"$sort": {"_id.month": 1}},
    ]).to_list(12)

    # 없는 달도 0으로 채워서 1~12월 전부 반환
    monthly_map = {r["_id"]["month"]: r for r in result}
    return {
        "year": year,
        "months": [
            {
                "month": m,
                "total": monthly_map[m]["total"] if m in monthly_map else 0,
                "count": monthly_map[m]["count"] if m in monthly_map else 0,
            }
            for m in range(1, 13)
        ],
    }


@router.get("/weekly")
async def weekly(
    current_user: dict = Depends(get_current_user),
    weeks: int = Query(8, ge=1, le=52, description="최근 몇 주"),
):
    """주별 지출 집계 (최근 N주)"""
    col = get_expenses_collection()
    uid = current_user["id"]
    since = datetime.utcnow() - timedelta(weeks=weeks)

    result = await col.aggregate([
        {"$match": {"user_id": uid, "date": {"$gte": since}}},
        {"$group": {
            "_id": {
                "year": {"$isoWeekYear": "$date"},
                "week": {"$isoWeek": "$date"},
            },
            "total": {"$sum": "$amount"},
            "count": {"$sum": 1},
        }},
        {"$sort": {"_id.year": 1, "_id.week": 1}},
    ]).to_list(52)

    return {
        "since": since.isoformat(),
        "weeks": [
            {
                "year": r["_id"]["year"],
                "week": r["_id"]["week"],
                "total": r["total"],
                "count": r["count"],
            }
            for r in result
        ],
    }


@router.get("/budget-alert")
async def budget_alert(current_user: dict = Depends(get_current_user)):
    """예산 초과 알림: 목표별 budget_limit 대비 이번 달 지출 비교"""
    uid = current_user["id"]
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)

    # 이번 달 카테고리별 지출
    expenses_col = get_expenses_collection()
    monthly_by_cat = await expenses_col.aggregate([
        {"$match": {"user_id": uid, "date": {"$gte": month_start}}},
        {"$group": {"_id": "$category", "spent": {"$sum": "$amount"}}},
    ]).to_list(100)
    spent_map = {r["_id"]: r["spent"] for r in monthly_by_cat}

    # 이번 달 전체 지출
    total_spent = sum(spent_map.values())

    # 목표 중 budget_limit 있는 것들 확인
    goals_col = get_goals_collection()
    goals = await goals_col.find(
        {"user_id": uid, "budget_limit": {"$exists": True, "$ne": None}}
    ).to_list(100)

    alerts = []
    for goal in goals:
        limit = goal["budget_limit"]
        spent = total_spent  # 전체 지출 기준 (카테고리 구분 없을 때)
        ratio = round(spent / limit * 100, 2) if limit > 0 else 0
        if ratio >= 80:  # 80% 이상이면 알림
            alerts.append({
                "goal_id":    str(goal["_id"]),
                "goal_title": goal["title"],
                "budget_limit": limit,
                "spent_this_month": spent,
                "usage_percent": ratio,
                "is_over_budget": ratio >= 100,
            })

    return {
        "month": f"{now.year}-{now.month:02d}",
        "total_spent_this_month": total_spent,
        "alerts": alerts,
        "has_alert": len(alerts) > 0,
    }
