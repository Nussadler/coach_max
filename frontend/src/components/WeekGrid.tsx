// Mapping für Workout-Typen zu Farben
const cardBgColor = (day: DayPlan): string => {
  const firstLine = (day.run || day.bike || day.strength || "").split("\n")[0].toLowerCase();
  if (firstLine.includes("gym")) return "#f3eaff"; // pastell-lila für Gym
  if (firstLine.includes("recovery") || firstLine.includes("rest")) return "#f3f3f3"; // hellgrau
  if (firstLine.includes("easy")) return "#e6f7e6"; // pastell grün
  if (firstLine.includes("base")) return "#e6f7e6"; // pastell grün
  if (firstLine.includes("threshold")) return "#fff4e0"; // pastell orange
  if (firstLine.includes("10k")) return "#fff4e0"; // pastell orange
  if (firstLine.includes("vo2max")) return "#ffeaea"; // pastell rot
  if (firstLine.includes("long run")) return "#e6f0fa"; // pastell blau
  return "#fff";
};
// src/components/WeekGrid.tsx
import React, { useState } from "react";
import { DayPlan } from "../data/plan";
import "../index.css";
import { Athlete } from "../data/athletes";

interface WeekGridProps {
  week: DayPlan[];
  athlete: Athlete;
}




function replaceIntensityZones(text: string, athlete: Athlete): React.ReactNode[] {
  // Finde alle Zonen-Keys im Text (z.B. Z1, Z2, Z3, Z4, Z5, BZ1, BZ2, ...)
  const zoneRegex = /\b(B?Z[1-5])\b/g;
  return text.split("\n").map((line, i) => {
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;
    while ((match = zoneRegex.exec(line)) !== null) {
      const [zone] = match;
      const idx = match.index;
      if (idx > lastIdx) parts.push(line.slice(lastIdx, idx));
      parts.push(
        <span key={zone + i} style={{ color: '#222' }}>
          {athlete.intensity[zone] || zone}
        </span>
      );
      lastIdx = idx + zone.length;
    }
    parts.push(line.slice(lastIdx));
    return <div key={i}>{parts}</div>;
  });
}


function renderWorkoutBlock(text: string, athlete: Athlete) {
  const lines = text.split("\n");
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontWeight: 700 }}>
        {replaceIntensityZones(lines[0], athlete)}
      </div>
      {lines.slice(1).map((l, i) => (
        <div key={i}>{replaceIntensityZones(l, athlete)}</div>
      ))}
    </div>
  );
}

export const WeekGrid: React.FC<WeekGridProps> = ({ week, athlete }) => (
  <div className="week-grid-responsive">
    {week.map((day) => {
      const override = day.athleteOverrides?.[athlete.id];
      let run = day.run, bike = day.bike, strength = day.strength, notes = day.notes;
      if (override) {
        // Wenn ein Override für ein Feld existiert, zeige nur dieses Feld an (kein Fallback auf Standard)
        run = override.run !== undefined ? override.run : undefined;
        bike = override.bike !== undefined ? override.bike : undefined;
        strength = override.strength !== undefined ? override.strength : undefined;
        notes = override.notes !== undefined ? override.notes : notes;
      }
      const [showNotes, setShowNotes] = useState(false);
      return (
        <div
          key={day.date + day.weekday}
          className="workout-card-responsive"
          style={{ background: cardBgColor({ ...day, run, bike, strength }) }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{day.date} <span style={{ fontWeight: 400, color: '#888', fontSize: 15 }}>{day.weekday}</span></div>
          {run && renderWorkoutBlock(run, athlete)}
          {bike && renderWorkoutBlock(bike, athlete)}
          {strength && renderWorkoutBlock(strength, athlete)}
          {!run && !bike && !strength && (
            <div style={{ color: '#888', marginTop: 12 }}>Ruhetag</div>
          )}
          {notes && (
            <div style={{ marginTop: 12 }}>
              <button
                style={{
                  background: "#f0f0f0",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  color: "#222",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 15,
                  padding: "6px 14px 6px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: showNotes ? "0 2px 8px #0001" : undefined,
                  transition: "box-shadow 0.2s"
                }}
                onClick={() => setShowNotes((v) => !v)}
              >
                <span style={{ display: 'inline-block', transform: showNotes ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', fontSize: 18, marginRight: 6 }}>&gt;</span>
                Notiz {showNotes ? "ausblenden" : "anzeigen"}
              </button>
              {showNotes && (
                <div style={{ marginTop: 8, background: "#f8f8fa", borderRadius: 8, padding: 10, color: "#333", fontSize: 15 }}>
                  {notes}
                </div>
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
