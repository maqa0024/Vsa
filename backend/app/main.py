from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import rooms, teachers, subjects, groups, schedule, semesters
from app.db.database import engine
from app.models import base

base.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Academic Scheduling System",
    description="University timetable management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router, prefix="/api/rooms", tags=["Rooms"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["Teachers"])
app.include_router(subjects.router, prefix="/api/subjects", tags=["Subjects"])
app.include_router(groups.router, prefix="/api/groups", tags=["Groups"])
app.include_router(semesters.router, prefix="/api/semesters", tags=["Semesters"])
app.include_router(schedule.router, prefix="/api/schedule", tags=["Schedule"])

@app.get("/")
def root():
    return {"message": "Academic Scheduling System API", "status": "running"}
