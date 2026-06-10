from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="지출 금액 (0보다 커야 함)")
    category: str = Field(..., min_length=1, description="카테고리")
    description: str = ""
    date: datetime = Field(default_factory=datetime.utcnow, description="지출 날짜")

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    date: Optional[datetime] = None

class ExpenseResponse(BaseModel):
    id: str
    amount: float
    category: str
    description: str
    date: datetime
    user_id: str
