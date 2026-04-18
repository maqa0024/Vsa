from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.group import Group
from app.schemas.schemas import GroupCreate, GroupOut

router = APIRouter()

@router.get("/", response_model=list[GroupOut])
def get_groups(db: Session = Depends(get_db)):
    return db.query(Group).all()

@router.post("/", response_model=GroupOut)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    db_group = Group(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.get("/{group_id}", response_model=GroupOut)
def get_group(group_id: int, db: Session = Depends(get_db)):
    g = db.query(Group).filter(Group.id == group_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Group not found")
    return g

@router.put("/{group_id}", response_model=GroupOut)
def update_group(group_id: int, group: GroupCreate, db: Session = Depends(get_db)):
    db_g = db.query(Group).filter(Group.id == group_id).first()
    if not db_g:
        raise HTTPException(status_code=404, detail="Group not found")
    for k, v in group.dict().items():
        setattr(db_g, k, v)
    db.commit()
    db.refresh(db_g)
    return db_g

@router.delete("/{group_id}")
def delete_group(group_id: int, db: Session = Depends(get_db)):
    db_g = db.query(Group).filter(Group.id == group_id).first()
    if not db_g:
        raise HTTPException(status_code=404, detail="Group not found")
    db.delete(db_g)
    db.commit()
    return {"message": "Group deleted"}
