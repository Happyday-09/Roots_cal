# 지출 관련 CRUD 기능을 제공하는 API 라우터입니다.
from fastapi import APIRouter, HTTPException, Depends, Query
from bson import ObjectId
from datetime import datetime

from app.core.auth import get_current_user
from app.core.database import get_expenses_collection
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

router = APIRouter(prefix="/expenses", tags=["Expenses"])


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
async def create_expense(
    expense: ExpenseCreate,
    current_user: dict = Depends(get_current_user),
):
    data = expense.model_dump()
    data["user_id"] = current_user["id"]
    result = await get_expenses_collection().insert_one(data)
    return {"id": str(result.inserted_id)}


@router.get("/")
async def get_expenses(
    current_user: dict = Depends(get_current_user),
    # 날짜 범위 필터
    start_date: Optional[datetime] = Query(None, description="시작 날짜 (ISO8601)"),
    end_date:   Optional[datetime] = Query(None, description="종료 날짜 (ISO8601)"),
    # 카테고리 필터
    category: Optional[str] = Query(None, description="카테고리 필터"),
    # 금액 범위 필터
    min_amount: Optional[float] = Query(None, description="최소 금액"),
    max_amount: Optional[float] = Query(None, description="최대 금액"),
    # 페이지네이션
    page: int = Query(1, ge=1, description="페이지 번호"),
    limit: int = Query(20, ge=1, le=100, description="페이지 당 개수"),
):
    query: dict = {"user_id": current_user["id"]}

    if start_date or end_date:
        query["date"] = {}
        if start_date:
            query["date"]["$gte"] = start_date
        if end_date:
            query["date"]["$lte"] = end_date

    if category:
        query["category"] = category

    col = get_expenses_collection()
    skip = (page - 1) * limit
    total = await col.count_documents(query)
    docs  = await col.find(query).sort("date", -1).skip(skip).limit(limit).to_list(limit)

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "items": [serialize(doc) for doc in docs],
    }


@router.get("/{expense_id}", response_model=dict)
async def get_expense(
    expense_id: str,
    current_user: dict = Depends(get_current_user),
):
    doc = await get_expenses_collection().find_one(
        {"_id": valid_oid(expense_id), "user_id": current_user["id"]}
    )
    try:
        if not doc:
            raise ValueError("지출 내역을 찾을 수 없습니다")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=404, detail="지출 내역을 찾을 수 없습니다")
    return serialize(doc)


@router.patch("/{expense_id}", response_model=dict)
async def update_expense(
    expense_id: str,
    body: ExpenseUpdate,
    current_user: dict = Depends(get_current_user),
):
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items()}
    try:
        if not updates:
            raise ValueError("수정할 항목이 없습니다")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=400, detail="수정할 항목이 없습니다")

    result = await get_expenses_collection().find_one_and_update(
        {"_id": valid_oid(expense_id), "user_id": current_user["id"]},
        {"$set": updates},
        return_document=True,
    )
    try:
        if not result:
            raise ValueError("지출 내역을 찾을 수 없습니다")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=404, detail="지출 내역을 찾을 수 없습니다")
    return serialize(result)


@router.delete("/{expense_id}", status_code=204)
async def delete_expense(
    expense_id: str,
    current_user: dict = Depends(get_current_user),
):
    result = await get_expenses_collection().delete_one(
        {"_id": valid_oid(expense_id), "user_id": current_user["id"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="지출 내역을 찾을 수 없습니다")
