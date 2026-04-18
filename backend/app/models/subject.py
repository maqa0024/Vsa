from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    credits = Column(Integer, nullable=False)
    lecture_hours = Column(Integer, default=0)
    seminar_hours = Column(Integer, default=0)
    lab_hours = Column(Integer, default=0)
