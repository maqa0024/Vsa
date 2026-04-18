"use client";

import { useState } from "react";
import { useScheduleStore } from "@/store/useScheduleStore";
import { checkConflicts, createEntry } from "@/lib/api";
import { DAYS, TIME_SLOTS } from "@/types";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function AddEntryModal({ onClose }: Props) {
  const { rooms, teachers, subjects, groups, activeSemester, addEntry } = useScheduleStore();

  const [form, setForm] = useState({
    subject_id: "",
    teacher_id: "",
    room_id: "",
    group_id: "",
    day_of_week: "1",
    start_time: "09:00",
    lesson_type: "lecture",
  });

  const [conflicts, setConflicts] = useState<any[]>([]);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  const getEndTime = (start: string) => {
    const [h, m] = start.split(":").map(Number);
    const end = new Date(2000, 0, 1, h, m + 90);
    return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}:00`;
  };

  const buildPayload = () => ({
    semester_id: activeSemester!.id,
    subject_id: parseInt(form.subject_id),
    teacher_id: parseInt(form.teacher_id),
    room_id: parseInt(form.room_id),
    group_id: parseInt(form.group_id),
    day_of_week: parseInt(form.day_of_week),
    start_time: `${form.start_time}:00`,
    end_time: getEndTime(form.start_time),
    lesson_type: form.lesson_type,
  });

  const handleCheck = async () => {
    if (!activeSemester) return;
    setChecking(true);
    try {
      const res = await checkConflicts(buildPayload());
      setConflicts(res.conflicts || []);
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    if (!activeSemester) return;
    setSaving(true);
    try {
      const entry = await createEntry(buildPayload());
      addEntry(entry);
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (detail?.conflicts) setConflicts(detail.conflicts);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">Yeni Dərs Əlavə Et</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Fənn</label>
            <select className={inputCls} value={form.subject_id} onChange={e => setForm(f => ({...f, subject_id: e.target.value}))}>
              <option value="">Seçin...</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Müəllim</label>
            <select className={inputCls} value={form.teacher_id} onChange={e => setForm(f => ({...f, teacher_id: e.target.value}))}>
              <option value="">Seçin...</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Otaq</label>
            <select className={inputCls} value={form.room_id} onChange={e => setForm(f => ({...f, room_id: e.target.value}))}>
              <option value="">Seçin...</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity} yer)</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Qrup</label>
            <select className={inputCls} value={form.group_id} onChange={e => setForm(f => ({...f, group_id: e.target.value}))}>
              <option value="">Seçin...</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Gün</label>
            <select className={inputCls} value={form.day_of_week} onChange={e => setForm(f => ({...f, day_of_week: e.target.value}))}>
              {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Başlama saatı</label>
            <select className={inputCls} value={form.start_time} onChange={e => setForm(f => ({...f, start_time: e.target.value}))}>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t} – {t.split(":")[0]}:{parseInt(t.split(":")[1]) + 90 < 60 ? "..." : "..."}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Dərs növü</label>
            <div className="flex gap-3">
              {["lecture", "seminar", "lab"].map(type => (
                <label key={type} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="lesson_type" value={type}
                    checked={form.lesson_type === type}
                    onChange={e => setForm(f => ({...f, lesson_type: e.target.value}))}
                  />
                  <span className="capitalize">{type === "lecture" ? "Mühazirə" : type === "seminar" ? "Seminar" : "Laboratoriya"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {conflicts.length > 0 && (
          <div className="mx-6 mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            {conflicts.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={12} /> {c.message}
              </div>
            ))}
          </div>
        )}
        {conflicts.length === 0 && checking === false && form.subject_id && (
          <div className="mx-6 mb-4 rounded-lg bg-green-50 border border-green-200 p-2 flex items-center gap-2 text-xs text-green-700">
            <CheckCircle size={12} /> Hazır görünür
          </div>
        )}

        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Ləğv et</button>
          <button onClick={handleCheck} disabled={checking}
            className="px-4 py-2 text-sm rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50">
            {checking ? "Yoxlanır..." : "Yoxla"}
          </button>
          <button onClick={handleSave} disabled={saving || !form.subject_id || !form.teacher_id || !form.room_id || !form.group_id}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40">
            {saving ? "Saxlanır..." : "Əlavə et"}
          </button>
        </div>
      </div>
    </div>
  );
}
