from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1, description="목표 이름")
    target_amount: float = Field(..., gt=0, description="목표 금액")
    deadline: Optional[datetime] = None
    description: str = ""
    budget_limit: Optional[float] = Field(None, gt=0, description="월 예산 한도 (초과 시 알림)")

class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    target_amount: Optional[float] = Field(None, gt=0)
    deadline: Optional[datetime] = None
    description: Optional[str] = None
    budget_limit: Optional[float] = Field(None, gt=0)

class GoalResponse(BaseModel):
    id: str
    title: str
    target_amount: float
    deadline: Optional[datetime]
    description: str
    budget_limit: Optional[float]
    created_at: datetime
    user_id: str
