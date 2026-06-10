# FastAPI 애플리케이션의 진입점입니다. 각 모듈의 라우터를 포함하여 앱을 구성합니다.
from contextlib import asynccontextmanager
from fastapi import FastAPI
from routers import expense, goal, stats, auth
from core.database import connect_db, close_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(title="AI Expense Manager", lifespan=lifespan)

app.include_router(auth.router)
app.include_router(expense.router)
app.include_router(goal.router)
app.include_router(stats.router)

@app.get("/")
async def root():
    return {"message": "Expense Manager API"}
