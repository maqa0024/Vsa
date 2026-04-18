import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// ---- Rooms ----
export const getRooms = () => api.get("/api/rooms/").then(r => r.data);
export const createRoom = (data: any) => api.post("/api/rooms/", data).then(r => r.data);
export const updateRoom = (id: number, data: any) => api.put(`/api/rooms/${id}`, data).then(r => r.data);
export const deleteRoom = (id: number) => api.delete(`/api/rooms/${id}`).then(r => r.data);

// ---- Teachers ----
export const getTeachers = () => api.get("/api/teachers/").then(r => r.data);
export const createTeacher = (data: any) => api.post("/api/teachers/", data).then(r => r.data);
export const deleteTeacher = (id: number) => api.delete(`/api/teachers/${id}`).then(r => r.data);

// ---- Subjects ----
export const getSubjects = () => api.get("/api/subjects/").then(r => r.data);
export const createSubject = (data: any) => api.post("/api/subjects/", data).then(r => r.data);
export const deleteSubject = (id: number) => api.delete(`/api/subjects/${id}`).then(r => r.data);

// ---- Groups ----
export const getGroups = () => api.get("/api/groups/").then(r => r.data);
export const createGroup = (data: any) => api.post("/api/groups/", data).then(r => r.data);
export const deleteGroup = (id: number) => api.delete(`/api/groups/${id}`).then(r => r.data);

// ---- Semesters ----
export const getSemesters = () => api.get("/api/semesters/").then(r => r.data);
export const createSemester = (data: any) => api.post("/api/semesters/", data).then(r => r.data);
export const activateSemester = (id: number) => api.patch(`/api/semesters/${id}/activate`).then(r => r.data);

// ---- Schedule ----
export const getSchedule = (semesterId: number) =>
  api.get(`/api/schedule/?semester_id=${semesterId}`).then(r => r.data);

export const checkConflicts = (data: any, excludeId?: number) => {
  const params = excludeId ? `?exclude_id=${excludeId}` : "";
  return api.post(`/api/schedule/check-conflicts${params}`, data).then(r => r.data);
};

export const createEntry = (data: any) => api.post("/api/schedule/", data).then(r => r.data);
export const updateEntry = (id: number, data: any) => api.put(`/api/schedule/${id}`, data).then(r => r.data);
export const deleteEntry = (id: number) => api.delete(`/api/schedule/${id}`).then(r => r.data);

export default api;
