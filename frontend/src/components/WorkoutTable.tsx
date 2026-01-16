import React from "react";

export interface WorkoutEntry {
  date: string;
  workout: string;
  distance?: string;
  pace?: string;
  hf?: string;
  warmup?: {
    distance: string;
    pace: string;
    hf: string;
  };
  intervals?: Array<{
    distance: string;
    pace: string;
    hf: string;
  }>;
  cooldown?: {
    distance: string;
    pace: string;
    hf: string;
  };
}

interface WorkoutTableProps {
  entries: WorkoutEntry[];
}

const WorkoutTable: React.FC<WorkoutTableProps> = ({ entries }) => (
  <div style={{ width: "100%", overflowX: "auto", marginTop: 32 }}>
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
            <tr key={idx}>
              <td style={{ padding: "7px 4px", borderBottom: "1px solid #f0f0f0" }}>{entry.date}</td>
              <td style={{ padding: "7px 4px", borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>{entry.workout}</td>
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

export default WorkoutTable;
