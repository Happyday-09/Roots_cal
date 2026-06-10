# 목표 설정 및 관리 기능을 제공하는 API 라우터입니다.
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends, Query
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

from app.core.auth import get_current_user
from app.core.database import get_goals_collection, get_expenses_collection
from app.schemas.goal import GoalCreate, GoalUpdate

router = APIRouter(prefix="/goals", tags=["Goals"])


def serialize(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

def valid_oid(oid: str) -> ObjectId:
    try:
        if not ObjectId.is_valid(oid):
            raise ValueError("유효하지 않은 ID입니다")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=400, detail="유효하지 않은 ID입니다")
    return ObjectId(oid)


@router.post("/", status_code=201)
async def create_goal(
    goal: GoalCreate,
    current_user: dict = Depends(get_current_user),
):
    data = goal.model_dump()
    data["user_id"] = current_user["id"]
    data["created_at"] = datetime.utcnow()
    result = await get_goals_collection().insert_one(data)
    return {"id": str(result.inserted_id)}


@router.get("/")
async def get_goals(
    current_user: dict = Depends(get_current_user),
    page:  int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    col = get_goals_collection()
    query = {"user_id": current_user["id"]}
    skip  = (page - 1) * limit
    total = await col.count_documents(query)
    docs  = await col.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "items": [serialize(doc) for doc in docs],
    }


@router.get("/{goal_id}", response_model=dict)
async def get_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user),
):
    """목표 단건 조회 + 달성률 계산"""
    doc = await get_goals_collection().find_one(
        {"_id": valid_oid(goal_id), "user_id": current_user["id"]}
    )
    try:
        if not doc:
            raise ValueError("목표를 찾을 수 없습니다")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=404, detail="목표를 찾을 수 없습니다")

    # 목표 생성일 이후의 지출 합계로 달성률 계산
    total_result = await get_expenses_collection().aggregate([
        {"$match": {
            "user_id": current_user["id"],
            "date": {"$gte": doc["created_at"]},
        }},
        {"$group": {"_id": None, "saved": {"$sum": "$amount"}}},
    ]).to_list(1)

    saved = total_result[0]["saved"] if total_result else 0
    target = doc["target_amount"]
    progress = round(min(saved / target * 100, 100), 2) if target > 0 else 0

    result = serialize(doc)
    result["saved_amount"] = saved
    result["progress_percent"] = progress
    result["remaining_amount"] = max(target - saved, 0)
    return result


@router.patch("/{goal_id}", response_model=dict)
async def update_goal(
    goal_id: str,
    body: GoalUpdate,
    current_user: dict = Depends(get_current_user),
):
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items()}
    try:
        if not updates:
            raise ValueError("수정할 항목이 없습니다")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=400, detail="수정할 항목이 없습니다")

    result = await get_goals_collection().find_one_and_update(
        {"_id": valid_oid(goal_id), "user_id": current_user["id"]},
        {"$set": updates},
        return_document=True,
    )
    try:
        if not result:
            raise ValueError("목표를 찾을 수 없습니다")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=404, detail="목표를 찾을 수 없습니다")
    return serialize(result)


@router.delete("/{goal_id}", status_code=204)
async def delete_goal(
    goal_id: str,
    current_user: dict = Depends(get_current_user),
):
    result = await get_goals_collection().delete_one(
        {"_id": valid_oid(goal_id), "user_id": current_user["id"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="목표를 찾을 수 없습니다")
