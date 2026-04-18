from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.schedule import ScheduleEntry
from app.schemas.schemas import ScheduleEntryCreate, ScheduleEntryOut
from app.services.conflict_checker import ScheduleConflictChecker

router = APIRouter()

@router.get("/", response_model=list[ScheduleEntryOut])
def get_schedule(semester_id: int, db: Session = Depends(get_db)):
    return db.query(ScheduleEntry).filter(ScheduleEntry.semester_id == semester_id).all()

@router.post("/check-conflicts")
def check_conflicts(entry: ScheduleEntryCreate, exclude_id: int = None, db: Session = Depends(get_db)):
    checker = ScheduleConflictChecker(db)
    entry_dict = entry.dict()
    entry_dict["start_time"] = str(entry_dict["start_time"])
    entry_dict["end_time"] = str(entry_dict["end_time"])
    conflicts = checker.check_all(entry_dict, exclude_id)
    return {
        "valid": len(conflicts) == 0,
        "conflicts": [
            {
                "conflict_type": c.conflict_type,
                "message": c.message,
                "conflicting_entry_id": c.conflicting_entry_id
            } for c in conflicts
        ]
    }

@router.post("/", response_model=ScheduleEntryOut)
def create_entry(entry: ScheduleEntryCreate, db: Session = Depends(get_db)):
    checker = ScheduleConflictChecker(db)
    entry_dict = entry.dict()
    entry_dict["start_time"] = str(entry_dict["start_time"])
    entry_dict["end_time"] = str(entry_dict["end_time"])
    conflicts = checker.check_all(entry_dict)
    if conflicts:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Conflict detected",
                "conflicts": [
                    {"type": c.conflict_type, "message": c.message}
                    for c in conflicts
                ]
            }
        )
    db_entry = ScheduleEntry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.put("/{entry_id}", response_model=ScheduleEntryOut)
def update_entry(entry_id: int, entry: ScheduleEntryCreate, db: Session = Depends(get_db)):
    db_entry = db.query(ScheduleEntry).filter(ScheduleEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    checker = ScheduleConflictChecker(db)
    entry_dict = entry.dict()
    entry_dict["start_time"] = str(entry_dict["start_time"])
    entry_dict["end_time"] = str(entry_dict["end_time"])
    conflicts = checker.check_all(entry_dict, exclude_id=entry_id)
    if conflicts:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Conflict detected",
                "conflicts": [{"type": c.conflict_type, "message": c.message} for c in conflicts]
            }
        )
    for k, v in entry.dict().items():
        setattr(db_entry, k, v)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = db.query(ScheduleEntry).filter(ScheduleEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(db_entry)
    db.commit()
    return {"message": "Entry deleted"}
