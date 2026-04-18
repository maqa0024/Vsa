from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.teacher import Teacher, TeacherAvailability
from app.schemas.schemas import TeacherCreate, TeacherOut

router = APIRouter()

@router.get("/", response_model=list[TeacherOut])
def get_teachers(db: Session = Depends(get_db)):
    return db.query(Teacher).all()

@router.post("/", response_model=TeacherOut)
def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    avail_data = teacher.availability
    teacher_data = teacher.dict(exclude={"availability"})
    db_teacher = Teacher(**teacher_data)
    db.add(db_teacher)
    db.flush()
    for a in avail_data:
        db.add(TeacherAvailability(teacher_id=db_teacher.id, **a.dict()))
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@router.get("/{teacher_id}", response_model=TeacherOut)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)):
    t = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return t

@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    t = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(t)
    db.commit()
    return {"message": "Teacher deleted"}
