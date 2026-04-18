from sqlalchemy import Column, Integer, ForeignKey, Time, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class ScheduleEntry(Base):
    __tablename__ = "schedule_entries"

    id = Column(Integer, primary_key=True, index=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    day_of_week = Column(Integer, nullable=False)  # 1=Monday...6=Saturday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    lesson_type = Column(String(50), nullable=False)  # lecture, seminar, lab

    semester = relationship("Semester")
    subject = relationship("Subject")
    teacher = relationship("Teacher")
    room = relationship("Room")
    group = relationship("Group")
