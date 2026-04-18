export interface Room {
  id: number;
  name: string;
  capacity: number;
  type: "lecture" | "lab" | "seminar";
  building?: string;
}

export interface TeacherAvailability {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Teacher {
  id: number;
  full_name: string;
  email: string;
  department?: string;
  specialization?: string;
  availability: TeacherAvailability[];
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  lecture_hours: number;
  seminar_hours: number;
  lab_hours: number;
}

export interface Group {
  id: number;
  name: string;
  student_count: number;
  specialization?: string;
  year_level?: number;
}

export interface Semester {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface ScheduleEntry {
  id: number;
  semester_id: number;
  subject_id: number;
  teacher_id: number;
  room_id: number;
  group_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  lesson_type: "lecture" | "seminar" | "lab";
  subject: Subject;
  teacher: Teacher;
  room: Room;
  group: Group;
}

export interface ConflictResult {
  has_conflict: boolean;
  conflict_type?: string;
  message: string;
  conflicting_entry_id?: number;
}

export interface ConflictCheckResponse {
  valid: boolean;
  conflicts: ConflictResult[];
}

export const DAYS = [
  { value: 1, label: "Bazar ertəsi" },
  { value: 2, label: "Çərşənbə axşamı" },
  { value: 3, label: "Çərşənbə" },
  { value: 4, label: "Cümə axşamı" },
  { value: 5, label: "Cümə" },
  { value: 6, label: "Şənbə" },
];

export const TIME_SLOTS = [
  "09:00", "10:30", "12:00", "13:30", "15:00", "16:30",
];

export const LESSON_COLORS: Record<string, string> = {
  lecture: "bg-blue-100 border-blue-400 text-blue-800",
  seminar: "bg-green-100 border-green-400 text-green-800",
  lab:     "bg-purple-100 border-purple-400 text-purple-800",
};
