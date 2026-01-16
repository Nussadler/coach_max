import React from "react";
import { WorkoutEntry } from "./WorkoutTable";

interface IntervalTableProps {
  entries: WorkoutEntry[];
}

const IntervalTable: React.FC<IntervalTableProps> = ({ entries }) => (
  <div style={{ width: "100%", overflowX: "auto", marginTop: 32 }}>
    <h3 style={{ textAlign: "center", fontWeight: 700, color: "#2c3e50", marginBottom: 12 }}>Intervalle & Intensiv Workouts</h3>
    {entries.length === 0 ? (
      <div style={{ textAlign: "center", color: "#7f8c8d", padding: 16 }}>Keine Intervalle geloggt.</div>
    ) : (
      entries.map((entry, idx) => (
        <div key={idx} style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 12px rgba(44,62,80,0.08)", marginBottom: 24, padding: 16 }}>
          <div style={{ fontWeight: 700, color: "#2c3e50", marginBottom: 8 }}>Datum: {entry.date}</div>
          <div style={{ marginBottom: 8, color: "#34495e" }}>Workout: <span style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{entry.workout}</span></div>
          {entry.warmup && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600, color: "#2980b9" }}>Warm Up</div>
              <div>Distanz: {entry.warmup.distance} km</div>
              <div>Pace: {entry.warmup.pace} min/km</div>
              <div>Ø HF: {entry.warmup.hf}</div>
            </div>
          )}
          {Array.isArray(entry.intervals) && entry.intervals.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600, color: "#2980b9" }}>Intervalle</div>
              {entry.intervals.map((int, i) => (
                <div key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
                  <div style={{ fontWeight: 500 }}>Intervall {i + 1}</div>
                  <div>Distanz: {int.distance} km</div>
                  <div>Pace: {int.pace} min/km</div>
                  <div>Ø HF: {int.hf}</div>
                </div>
              ))}
            </div>
          )}
          {entry.cooldown && (
            <div>
              <div style={{ fontWeight: 600, color: "#2980b9" }}>Cool Down</div>
              <div>Distanz: {entry.cooldown.distance} km</div>
              <div>Pace: {entry.cooldown.pace} min/km</div>
              <div>Ø HF: {entry.cooldown.hf}</div>
            </div>
          )}
        </div>
      ))
    )}
  </div>
);

export default IntervalTable;
