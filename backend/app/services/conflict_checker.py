from sqlalchemy.orm import Session
from sqlalchemy import text
from dataclasses import dataclass
from typing import Optional
from enum import Enum

class ConflictType(str, Enum):
    ROOM_OVERLAP     = "room_overlap"
    TEACHER_OVERLAP  = "teacher_overlap"
    CAPACITY_EXCEED  = "capacity_exceed"
    UNAVAILABLE      = "teacher_unavailable"

@dataclass
class ConflictResult:
    has_conflict: bool
    conflict_type: Optional[ConflictType] = None
    message: str = ""
    conflicting_entry_id: Optional[int] = None

class ScheduleConflictChecker:
    def __init__(self, db: Session):
        self.db = db

    def check_all(self, entry: dict, exclude_id: int = None) -> list[ConflictResult]:
        conflicts = []
        for check in [
            self.check_room_overlap,
            self.check_teacher_overlap,
            self.check_teacher_availability,
            self.check_room_capacity,
        ]:
            result = check(entry, exclude_id)
            if result.has_conflict:
                conflicts.append(result)
        return conflicts

    def check_room_overlap(self, entry: dict, exclude_id=None) -> ConflictResult:
        row = self.db.execute(text("""
            SELECT id FROM schedule_entries
            WHERE room_id = :room_id
              AND day_of_week = :day_of_week
              AND semester_id = :semester_id
              AND id != COALESCE(:exclude_id, -1)
              AND start_time < :end_time
              AND end_time > :start_time
        """), {**entry, "exclude_id": exclude_id}).fetchone()
        if row:
            return ConflictResult(True, ConflictType.ROOM_OVERLAP,
                "Bu otaq həmin saatda artıq doludur.", row[0])
        return ConflictResult(False)

    def check_teacher_overlap(self, entry: dict, exclude_id=None) -> ConflictResult:
        row = self.db.execute(text("""
            SELECT id FROM schedule_entries
            WHERE teacher_id = :teacher_id
              AND day_of_week = :day_of_week
              AND semester_id = :semester_id
              AND id != COALESCE(:exclude_id, -1)
              AND start_time < :end_time
              AND end_time > :start_time
        """), {**entry, "exclude_id": exclude_id}).fetchone()
        if row:
            return ConflictResult(True, ConflictType.TEACHER_OVERLAP,
                "Müəllim bu saatda başqa dərsdədir.", row[0])
        return ConflictResult(False)

    def check_teacher_availability(self, entry: dict, exclude_id=None) -> ConflictResult:
        row = self.db.execute(text("""
            SELECT id FROM teacher_availability
            WHERE teacher_id = :teacher_id
              AND day_of_week = :day_of_week
              AND start_time <= :start_time
              AND end_time >= :end_time
        """), entry).fetchone()
        if not row:
            return ConflictResult(True, ConflictType.UNAVAILABLE,
                "Müəllim bu saatda mövcud deyil.")
        return ConflictResult(False)

    def check_room_capacity(self, entry: dict, exclude_id=None) -> ConflictResult:
        row = self.db.execute(text("""
            SELECT r.capacity, g.student_count
            FROM rooms r, groups g
            WHERE r.id = :room_id AND g.id = :group_id
        """), entry).fetchone()
        if row and row[1] > row[0]:
            return ConflictResult(True, ConflictType.CAPACITY_EXCEED,
                f"Qrupdakı {row[1]} tələbə otağın {row[0]} yerlik tutumundan çoxdur.")
        return ConflictResult(False)
