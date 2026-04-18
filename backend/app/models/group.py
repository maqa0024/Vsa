from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    student_count = Column(Integer, nullable=False)
    specialization = Column(String(200))
    year_level = Column(Integer)
