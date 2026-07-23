from pydantic import BaseModel
from fastapi_users import schemas
import uuid
from typing import Optional
from datetime import datetime
from typing import List

class UserRead(schemas.BaseUser[uuid.UUID]):
  username: str
  profile_image_url: Optional[str] = None

class UserCreate(schemas.BaseUserCreate):
  username: str

class UserUpdate(schemas.BaseUserUpdate):
  username: Optional[str] = None
  profile_image_url: Optional[str] = None

class TagResponse(BaseModel):
  id: uuid.UUID
  name: str

  class Config:
    from_attributes = True


class StudentCreate(BaseModel):
  first_name: str
  last_name: str
  nationality: Optional[str] = None
  phone_number: Optional[str] = None
  email: Optional[str] = None
  date_of_birth: Optional[datetime] = None
  level: Optional[str] = None
  description: Optional[str] = None
  notes: Optional[str] = None
  tags: List[str] = []  # tag names, e.g. ["Business English", "Morning"]


class StudentUpdate(BaseModel):
  first_name: Optional[str] = None
  last_name: Optional[str] = None
  nationality: Optional[str] = None
  phone_number: Optional[str] = None
  email: Optional[str] = None
  date_of_birth: Optional[datetime] = None
  level: Optional[str] = None
  description: Optional[str] = None
  notes: Optional[str] = None
  tags: Optional[List[str]] = None  # None = don't touch tags, [] = clear them


class StudentResponse(BaseModel):
  id: uuid.UUID
  teacher_id: uuid.UUID
  first_name: str
  last_name: str
  nationality: Optional[str]
  phone_number: Optional[str]
  email: Optional[str]
  date_of_birth: Optional[datetime]
  level: Optional[str]
  description: Optional[str]
  notes: Optional[str]
  profile_image_url: Optional[str]
  created_at: datetime
  tags: List[TagResponse] = []

  class Config:
    from_attributes = True