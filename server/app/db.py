from collections.abc import AsyncGenerator
from datetime import datetime, timezone
import uuid

from fastapi import Depends
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy import Column, DateTime, ForeignKey, String, Table, Text, UUID
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, relationship
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is missing from the .env file")
class Base(DeclarativeBase):
  pass

class User(SQLAlchemyBaseUserTableUUID, Base):
  username = Column(String, unique=True, nullable=False)
  profile_image_url = Column(String, nullable=True)

  students = relationship("Student", back_populates="teacher")

student_tags = Table(
  "student_tags",
  Base.metadata,
  Column("student_id", UUID(as_uuid=True), ForeignKey("students.id"), primary_key=True),
  Column("tag_id", UUID(as_uuid=True), ForeignKey("tags.id"), primary_key=True),
)

class Tag(Base):
  __tablename__ = "tags"

  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  name = Column(String, unique=True, nullable=False)

  students = relationship("Student", secondary=student_tags, back_populates="tags")

class Student(Base):
  __tablename__ = "students"

  id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  teacher_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)

  first_name = Column(String, nullable=False)
  last_name = Column(String, nullable=False)
  nationality = Column(String, nullable=True)
  phone_number = Column(String, nullable=True)
  email = Column(String, nullable=True)
  date_of_birth = Column(DateTime, nullable=True)
  level = Column(String, nullable=True)
  description = Column(Text, nullable=True)
  notes = Column(Text, nullable=True)
  profile_image_url = Column(String, nullable=True)
  created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
  teacher = relationship("User", back_populates="students")
  tags = relationship("Tag", secondary=student_tags, back_populates="students")

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def create_db_and_tables():
  async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
  async with async_session_maker() as session:
    yield session

async def get_user_db(session: AsyncSession = Depends(get_async_session)):
  yield SQLAlchemyUserDatabase(session, User)