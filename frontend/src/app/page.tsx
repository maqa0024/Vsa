"use client";

import { useEffect, useState } from "react";
import {
  getRooms, getTeachers, getSubjects, getGroups,
  getSemesters, getSchedule, deleteEntry
} from "@/lib/api";
import { useScheduleStore } from "@/store/useScheduleStore";
import ScheduleGrid from "@/components/schedule/ScheduleGrid";
import AddEntryModal from "@/components/schedule/AddEntryModal";
import { CalendarDays, Plus, RefreshCw } from "lucide-react";

export default function HomePage() {
  const {
    setRooms, setTeachers, setSubjects, setGroups,
    setSemesters, setActiveSemester, setEntries,
    activeSemester, semesters
  } = useScheduleStore();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rooms, teachers, subjects, groups, sems] = await Promise.all([
        getRooms(), getTeachers(), getSubjects(), getGroups(), getSemesters(),
      ]);
      setRooms(rooms);
      setTeachers(teachers);
      setSubjects(subjects);
      setGroups(groups);
      setSemesters(sems);
      const active = sems.find((s: any) => s.is_active) || sems[0] || null;
      setActiveSemester(active);
      if (active) {
        const entries = await getSchedule(active.id);
        setEntries(entries);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-blue-600" size={24} />
          <div>
            <h1 className="font-bold text-gray-900">Dərs Cədvəli İdarəetmə Sistemi</h1>
            {activeSemester && (
              <p className="text-xs text-gray-500">Aktiv semestr: {activeSemester.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={activeSemester?.id || ""}
            onChange={async (e) => {
              const sem = semesters.find(s => s.id === parseInt(e.target.value));
              if (sem) {
                setActiveSemester(sem);
                const entries = await getSchedule(sem.id);
                setEntries(entries);
              }
            }}
          >
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button onClick={loadData}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus size={16} /> Dərs əlavə et
          </button>
        </div>
      </header>

      {/* Legend */}
      <div className="px-6 py-3 flex items-center gap-4 text-xs text-gray-600 border-b bg-white">
        <span className="font-medium">Rəng:</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-200 border-l-2 border-blue-400 inline-block"></span>Mühazirə</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-200 border-l-2 border-green-400 inline-block"></span>Seminar</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-200 border-l-2 border-purple-400 inline-block"></span>Laboratoriya</span>
        <span className="ml-4 text-gray-400">Dərsi sürüşdürüb başqa vaxta aparın</span>
      </div>

      {/* Main Grid */}
      <main className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">
            <RefreshCw className="animate-spin mr-2" size={20} /> Yüklənir...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <ScheduleGrid />
          </div>
        )}
      </main>

      {showModal && <AddEntryModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
