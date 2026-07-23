from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from app.schemas import (
    UserRead, UserCreate, UserUpdate,
    StudentCreate, StudentUpdate, StudentResponse, TagResponse,
)
from app.db import Student, Tag, create_db_and_tables, get_async_session, User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from contextlib import asynccontextmanager
from sqlalchemy import select
from app.images import imageKit
from pathlib import Path
import shutil
import os
import tempfile
import asyncio
import uuid
from app.users import auth_backend, current_active_user, fastapi_users
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fastapi_users.get_auth_router(auth_backend), prefix='/auth/jwt', tags=["auth"])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"])


@app.post("/users/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    temp_file_path = None
    try:
        file_ext=os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)

        upload_result = await asyncio.to_thread(
            imageKit.files.upload,
            file=Path(temp_file_path),
            file_name=file.filename,
            use_unique_file_name=True,
            tags=["avatar"]
        )

        user.profile_image_url = upload_result.url
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return {"profile_image_url": user.profile_image_url
    }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        await file.close()

async def _resolve_tags(tag_names: list[str], session: AsyncSession) -> list[Tag]:
    """Get-or-create Tag rows for a list of tag name strings."""
    resolved = []
    for name in tag_names:
        name = name.strip()
        if not name:
            continue
        result = await session.execute(select(Tag).where(Tag.name == name))
        tag = result.scalars().first()
        if not tag:
            tag = Tag(name=name)
            session.add(tag)
            await session.flush() 
        resolved.append(tag)
    return resolved


@app.post("/students", response_model=StudentResponse)
async def create_student(
    payload: StudentCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    tag_objs = await _resolve_tags(payload.tags, session)

    student = Student(
        teacher_id=user.id,
        first_name=payload.first_name,
        last_name=payload.last_name,
        nationality=payload.nationality,
        phone_number=payload.phone_number,
        email=payload.email,
        date_of_birth=payload.date_of_birth,
        level=payload.level,
        description=payload.description,
        notes=payload.notes,
        tags=tag_objs,
    )
    session.add(student)
    await session.commit()
    await session.refresh(student, attribute_names=["tags"])
    return student


@app.get("/students", response_model=list[StudentResponse])
async def list_students(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    result = await session.execute(
        select(Student)
        .where(Student.teacher_id == user.id)
        .options(selectinload(Student.tags))
        .order_by(Student.created_at.desc())
    )
    return result.scalars().all()


@app.get("/students/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: str,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    student = await _get_owned_student(student_id, user, session)
    return student


@app.patch("/students/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    payload: StudentUpdate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    student = await _get_owned_student(student_id, user, session)

    update_data = payload.model_dump(exclude_unset=True, exclude={"tags"})
    for field, value in update_data.items():
        setattr(student, field, value)

    if payload.tags is not None:
        student.tags = await _resolve_tags(payload.tags, session)

    session.add(student)
    await session.commit()
    await session.refresh(student, attribute_names=["tags"])
    return student


@app.delete("/students/{student_id}")
async def delete_student(
    student_id: str,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    student = await _get_owned_student(student_id, user, session)
    await session.delete(student)
    await session.commit()
    return {"success": True, "message": "Student deleted successfully"}


@app.post("/students/{student_id}/photo", response_model=StudentResponse)
async def upload_student_photo(
    student_id: str,
    file: UploadFile = File(...),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    student = await _get_owned_student(student_id, user, session)
    temp_file_path = None
    try:
        file_ext = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)

        upload_result = await asyncio.to_thread(
            imageKit.files.upload,
            file=Path(temp_file_path),
            file_name=file.filename,
            use_unique_file_name=True,
            tags=["student-photo"]
        )

        student.profile_image_url = upload_result.url
        session.add(student)
        await session.commit()
        await session.refresh(student, attribute_names=["tags"])
        return student
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        await file.close()


async def _get_owned_student(student_id: str, user: User, session: AsyncSession) -> Student:
    try:
        student_uuid = uuid.UUID(student_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid student id")

    result = await session.execute(
        select(Student)
        .where(Student.id == student_uuid)
        .options(selectinload(Student.tags))
    )
    student = result.scalars().first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if student.teacher_id != user.id:
        raise HTTPException(status_code=403, detail="You don't have permission to access this student")

    return student


@app.get("/tags", response_model=list[TagResponse])
async def list_tags(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    result = await session.execute(select(Tag).order_by(Tag.name))
    return result.scalars().all()