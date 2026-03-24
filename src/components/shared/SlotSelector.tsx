/**
 * SlotSelector — day picker + time range → auto-generated slots
 * Used by Consultations & Accounting vendor profiles
 */
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface SlotConfig {
  activeDays: string[];
  startTime: string;
  endTime: string;
  duration: number; // minutes
  selectedSlots: string[];
}

interface Props {
  value: SlotConfig;
  onChange: (config: SlotConfig) => void;
}

function generateSlots(start: string, end: string, duration: number): string[] {
  if (!start || !end || duration <= 0) return [];
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (startMin + duration <= endMin) {
    const slotEnd = startMin + duration;
    const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    slots.push(`${fmt(startMin)}–${fmt(slotEnd)}`);
    startMin = slotEnd;
  }
  return slots;
}

export default function SlotSelector({ value, onChange }: Props) {
  const update = (key: string, val: any) => onChange({ ...value, [key]: val });

  const toggleDay = (day: string) => {
    const current = value.activeDays;
    update("activeDays", current.includes(day) ? current.filter((d) => d !== day) : [...current, day]);
  };

  const generatedSlots = useMemo(
    () => generateSlots(value.startTime, value.endTime, value.duration),
    [value.startTime, value.endTime, value.duration]
  );

  const toggleSlot = (slot: string) => {
    const current = value.selectedSlots;
    update("selectedSlots", current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot]);
  };

  const selectAll = () => update("selectedSlots", [...generatedSlots]);
  const clearAll = () => update("selectedSlots", []);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Active Days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-lg px-3 py-2 text-xs font-medium border transition-colors ${
                value.activeDays.includes(day)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">Start Time</label>
          <Input type="time" value={value.startTime} onChange={(e) => update("startTime", e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">End Time</label>
          <Input type="time" value={value.endTime} onChange={(e) => update("endTime", e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Duration (min)</label>
          <Input type="number" min={15} step={15} value={value.duration} onChange={(e) => update("duration", Number(e.target.value))} className="mt-1" />
        </div>
      </div>

      {generatedSlots.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Available Slots ({value.selectedSlots.length}/{generatedSlots.length})
            </label>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={selectAll} className="text-xs h-7">Select All</Button>
              <Button type="button" size="sm" variant="outline" onClick={clearAll} className="text-xs h-7">Clear</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {generatedSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => toggleSlot(slot)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                  value.selectedSlots.includes(slot)
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-secondary text-muted-foreground border-border hover:border-primary/20"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
