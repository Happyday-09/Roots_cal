from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.auth import hash_password, verify_password, create_access_token, get_current_user
from app.core.database import get_users_collection
from app.schemas.user import UserRegister, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: UserRegister):
    collection = get_users_collection()

    # 이메일 중복 확인
    if await collection.find_one({"email": body.email}):
        raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다")

    user_doc = {
        "email": body.email,
        "password": hash_password(body.password),
        "name": body.name,
    }
    result = await collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": body.email})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user_id, email=body.email, name=body.name),
    )


@router.post("/login", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    """OAuth2 표준 폼 로그인 (username 필드에 이메일 입력)"""
    collection = get_users_collection()
    user = await collection.find_one({"email": form.username})

    if not user or not verify_password(form.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({"sub": user["email"]})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=str(user["_id"]), email=user["email"], name=user["name"]),
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    """현재 로그인한 사용자 정보"""
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        name=current_user["name"],
    )
