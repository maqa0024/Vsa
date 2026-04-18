"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ScheduleEntry, DAYS, TIME_SLOTS, LESSON_COLORS } from "@/types";
import { updateEntry } from "@/lib/api";
import { useScheduleStore } from "@/store/useScheduleStore";
import { Trash2, AlertCircle } from "lucide-react";

// ---- Lesson Card ----
function LessonCard({ entry, onDelete }: { entry: ScheduleEntry; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entry.id,
    data: entry,
  });

  const colorClass = LESSON_COLORS[entry.lesson_type] || "bg-gray-100 border-gray-400";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : 1,
      }}
      className={`relative rounded border-l-4 p-1.5 text-xs cursor-grab select-none ${colorClass}`}
    >
      <div className="font-semibold truncate">{entry.subject?.name}</div>
      <div className="truncate opacity-75">{entry.teacher?.full_name}</div>
      <div className="truncate opacity-75">{entry.room?.name} · {entry.group?.name}</div>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
        className="absolute top-1 right-1 text-red-400 hover:text-red-600"
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
}

// ---- Drop Cell ----
function DropCell({
  day,
  time,
  entries,
  onDelete,
}: {
  day: number;
  time: string;
  entries: ScheduleEntry[];
  onDelete: (id: number) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `${day}-${time}` });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] border border-gray-100 p-1 transition-colors ${
        isOver ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-gray-50"
      }`}
    >
      {entries.map((e) => (
        <LessonCard key={e.id} entry={e} onDelete={onDelete} />
      ))}
    </div>
  );
}

// ---- Main Grid ----
export default function ScheduleGrid() {
  const { entries, updateEntry: storeUpdate, removeEntry } = useScheduleStore();
  const [activeEntry, setActiveEntry] = useState<ScheduleEntry | null>(null);
  const [conflictMsg, setConflictMsg] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const getEntries = (day: number, time: string) =>
    entries.filter((e) => e.day_of_week === day && e.start_time === `${time}:00`);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveEntry(event.active.data.current as ScheduleEntry);
    setConflictMsg(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveEntry(null);
    if (!over || !active.data.current) return;

    const [dayStr, time] = (over.id as string).split("-");
    const day = parseInt(dayStr);
    const entry = active.data.current as ScheduleEntry;

    if (entry.day_of_week === day && entry.start_time === `${time}:00`) return;

    // Calculate new end time (90 min blocks)
    const [h, m] = time.split(":").map(Number);
    const endDate = new Date(2000, 0, 1, h, m + 90);
    const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

    const updated = {
      ...entry,
      day_of_week: day,
      start_time: `${time}:00`,
      end_time: `${endTime}:00`,
    };

    try {
      const result = await updateEntry(entry.id, {
        semester_id: entry.semester_id,
        subject_id: entry.subject_id,
        teacher_id: entry.teacher_id,
        room_id: entry.room_id,
        group_id: entry.group_id,
        day_of_week: day,
        start_time: `${time}:00`,
        end_time: `${endTime}:00`,
        lesson_type: entry.lesson_type,
      });
      storeUpdate({ ...updated, ...result });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (detail?.conflicts) {
        setConflictMsg(detail.conflicts.map((c: any) => c.message).join("; "));
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {conflictMsg && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle size={16} />
          <span>{conflictMsg}</span>
          <button onClick={() => setConflictMsg(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-20 bg-gray-50 border border-gray-200 p-2 text-xs text-gray-500">Saat</th>
              {DAYS.map((d) => (
                <th key={d.value} className="bg-gray-50 border border-gray-200 p-2 text-xs font-semibold text-gray-700">
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time) => (
              <tr key={time}>
                <td className="bg-gray-50 border border-gray-200 p-2 text-xs text-center text-gray-500 font-mono">
                  {time}
                </td>
                {DAYS.map((d) => (
                  <td key={d.value} className="border border-gray-200 p-0">
                    <DropCell
                      day={d.value}
                      time={time}
                      entries={getEntries(d.value, time)}
                      onDelete={removeEntry}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <DragOverlay>
          {activeEntry && (
            <div className={`rounded border-l-4 p-2 text-xs shadow-lg ${LESSON_COLORS[activeEntry.lesson_type]}`}>
              <div className="font-semibold">{activeEntry.subject?.name}</div>
              <div>{activeEntry.teacher?.full_name}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
