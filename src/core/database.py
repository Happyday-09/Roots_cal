# 데이터베이스 연결과 관리 관련 로직을 포함합니다.
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


client: AsyncIOMotorClient = None


def get_database():
    return client[settings.DATABASE_NAME]


async def connect_db():
    global client
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
        # 연결 확인
        await client.admin.command("ping")
        print("✅ MongoDB 연결 성공")
    except Exception as e:
        print(f"❌ MongoDB 연결 실패: {e}")
        raise


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB 연결 종료")

def get_users_collection():
    return get_database()["users"]

def get_expenses_collection():
    return get_database()["expenses"]

def get_goals_collection():
    return get_database()["goals"]
