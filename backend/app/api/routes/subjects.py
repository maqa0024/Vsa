from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.subject import Subject
from app.schemas.schemas import SubjectCreate, SubjectOut

router = APIRouter()

@router.get("/", response_model=list[SubjectOut])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()

@router.post("/", response_model=SubjectOut)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    db_subject = Subject(**subject.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/{subject_id}", response_model=SubjectOut)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    s = db.query(Subject).filter(Subject.id == subject_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Subject not found")
    return s

@router.put("/{subject_id}", response_model=SubjectOut)
def update_subject(subject_id: int, subject: SubjectCreate, db: Session = Depends(get_db)):
    db_s = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_s:
        raise HTTPException(status_code=404, detail="Subject not found")
    for k, v in subject.dict().items():
        setattr(db_s, k, v)
    db.commit()
    db.refresh(db_s)
    return db_s

@router.delete("/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    db_s = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_s:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(db_s)
    db.commit()
    return {"message": "Subject deleted"}
