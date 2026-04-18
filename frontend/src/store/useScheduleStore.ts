import { create } from "zustand";
import { Room, Teacher, Subject, Group, Semester, ScheduleEntry } from "@/types";

interface ScheduleStore {
  rooms: Room[];
  teachers: Teacher[];
  subjects: Subject[];
  groups: Group[];
  semesters: Semester[];
  activeSemester: Semester | null;
  entries: ScheduleEntry[];

  setRooms: (rooms: Room[]) => void;
  setTeachers: (teachers: Teacher[]) => void;
  setSubjects: (subjects: Subject[]) => void;
  setGroups: (groups: Group[]) => void;
  setSemesters: (semesters: Semester[]) => void;
  setActiveSemester: (s: Semester | null) => void;
  setEntries: (entries: ScheduleEntry[]) => void;
  addEntry: (entry: ScheduleEntry) => void;
  updateEntry: (entry: ScheduleEntry) => void;
  removeEntry: (id: number) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  rooms: [],
  teachers: [],
  subjects: [],
  groups: [],
  semesters: [],
  activeSemester: null,
  entries: [],

  setRooms: (rooms) => set({ rooms }),
  setTeachers: (teachers) => set({ teachers }),
  setSubjects: (subjects) => set({ subjects }),
  setGroups: (groups) => set({ groups }),
  setSemesters: (semesters) => set({ semesters }),
  setActiveSemester: (activeSemester) => set({ activeSemester }),
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
  updateEntry: (entry) =>
    set((s) => ({ entries: s.entries.map((e) => (e.id === entry.id ? entry : e)) })),
  removeEntry: (id) =>
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
}));
