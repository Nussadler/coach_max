import React from "react";
import { WorkoutEntry } from "./WorkoutTable";

interface WorkoutTableProps {
  entries: WorkoutEntry[];
  title: string;
}

const WorkoutTableFull: React.FC<WorkoutTableProps> = ({ entries, title }) => {
  function getWorkoutBgColor(workout: string) {
    const firstLine = (workout || "").split("\n")[0].toLowerCase();
    if (firstLine.includes("gym")) return "#f3eaff";
    if (firstLine.includes("recovery") || firstLine.includes("rest")) return "#f3f3f3";
    if (firstLine.includes("easy")) return "#e6f7e6";
    if (firstLine.includes("base")) return "#e6f7e6";
    if (firstLine.includes("threshold")) return "#fff4e0";
    if (firstLine.includes("10k")) return "#fff4e0";
    if (firstLine.includes("vo2max")) return "#ffeaea";
    if (firstLine.includes("long run")) return "#e6f0fa";
    return "#fff";
  }
  return (
    <div style={{ width: "100%", overflowX: "auto", marginTop: 32 }}>
      <h3 style={{ textAlign: "center", fontWeight: 700, color: "#2c3e50", marginBottom: 12 }}>{title}</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 320, background: "white", borderRadius: 12, boxShadow: "0 2px 12px rgba(44,62,80,0.08)", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f5f7fa" }}>
            <th style={{ padding: "8px 4px", fontWeight: 700, color: "#2c3e50", borderBottom: "1px solid #c3cfe2", minWidth: 70 }}>Datum</th>
            <th style={{ padding: "8px 4px", fontWeight: 700, color: "#2c3e50", borderBottom: "1px solid #c3cfe2", minWidth: 90 }}>Workout</th>
            <th style={{ padding: "8px 4px", fontWeight: 700, color: "#2c3e50", borderBottom: "1px solid #c3cfe2", minWidth: 60 }}>Distanz</th>
            <th style={{ padding: "8px 4px", fontWeight: 700, color: "#2c3e50", borderBottom: "1px solid #c3cfe2", minWidth: 60 }}>Pace</th>
            <th style={{ padding: "8px 4px", fontWeight: 700, color: "#2c3e50", borderBottom: "1px solid #c3cfe2", minWidth: 60 }}>Ø HF</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 16, color: "#7f8c8d" }}>Keine Workouts geloggt.</td>
            </tr>
          ) : (
            entries.map((entry, idx) => (
              <tr key={idx} style={{ background: getWorkoutBgColor(entry.workout) }}>
                <td style={{ padding: "7px 4px", borderBottom: "1px solid #f0f0f0" }}>{entry.date}</td>
                <td style={{ padding: "7px 4px", borderBottom: "1px solid #f0f0f0", whiteSpace: "pre-line", wordBreak: "break-word", maxWidth: 180 }}>{entry.workout}</td>
                <td style={{ padding: "7px 4px", borderBottom: "1px solid #f0f0f0" }}>{entry.distance}</td>
                <td style={{ padding: "7px 4px", borderBottom: "1px solid #f0f0f0" }}>{entry.pace}</td>
                <td style={{ padding: "7px 4px", borderBottom: "1px solid #f0f0f0" }}>{entry.hf}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkoutTableFull;
