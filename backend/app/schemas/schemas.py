from pydantic import BaseModel
from typing import Optional
from datetime import time, date

# ---- Room ----
class RoomBase(BaseModel):
    name: str
    capacity: int
    type: str
    building: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomOut(RoomBase):
    id: int
    class Config:
        from_attributes = True

# ---- Teacher ----
class AvailabilityBase(BaseModel):
    day_of_week: int
    start_time: time
    end_time: time

class AvailabilityOut(AvailabilityBase):
    id: int
    class Config:
        from_attributes = True

class TeacherBase(BaseModel):
    full_name: str
    email: str
    department: Optional[str] = None
    specialization: Optional[str] = None

class TeacherCreate(TeacherBase):
    availability: list[AvailabilityBase] = []

class TeacherOut(TeacherBase):
    id: int
    availability: list[AvailabilityOut] = []
    class Config:
        from_attributes = True

# ---- Subject ----
class SubjectBase(BaseModel):
    name: str
    code: str
    credits: int
    lecture_hours: int = 0
    seminar_hours: int = 0
    lab_hours: int = 0

class SubjectCreate(SubjectBase):
    pass

class SubjectOut(SubjectBase):
    id: int
    class Config:
        from_attributes = True

# ---- Group ----
class GroupBase(BaseModel):
    name: str
    student_count: int
    specialization: Optional[str] = None
    year_level: Optional[int] = None

class GroupCreate(GroupBase):
    pass

class GroupOut(GroupBase):
    id: int
    class Config:
        from_attributes = True

# ---- Semester ----
class SemesterBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    is_active: bool = False

class SemesterCreate(SemesterBase):
    pass

class SemesterOut(SemesterBase):
    id: int
    class Config:
        from_attributes = True

# ---- Schedule ----
class ScheduleEntryBase(BaseModel):
    semester_id: int
    subject_id: int
    teacher_id: int
    room_id: int
    group_id: int
    day_of_week: int
    start_time: time
    end_time: time
    lesson_type: str

class ScheduleEntryCreate(ScheduleEntryBase):
    pass

class ScheduleEntryOut(ScheduleEntryBase):
    id: int
    subject: SubjectOut
    teacher: TeacherOut
    room: RoomOut
    group: GroupOut
    class Config:
        from_attributes = True

# ---- Conflict ----
class ConflictResult(BaseModel):
    has_conflict: bool
    conflict_type: Optional[str] = None
    message: str = ""
    conflicting_entry_id: Optional[int] = None
