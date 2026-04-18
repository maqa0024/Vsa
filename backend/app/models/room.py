from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)  # lecture, lab, seminar
    building = Column(String(100))
