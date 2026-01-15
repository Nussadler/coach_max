// src/components/WorkoutCard.tsx
import React from "react";
import { Workout } from "../data/plan";
import { formatDistanceOrDuration } from "../helpers/format";

interface WorkoutCardProps {
  workout: Workout;
  intensityLabel?: string;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, intensityLabel }) => (
  <div style={{
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 8px #0001",
    padding: 18,
    minWidth: 160,
    minHeight: 160,
    display: "flex",
    flexDirection: "column",
    gap: 8
  }}>
    <div style={{ fontWeight: 700, fontSize: 18 }}>{workout.day}</div>
    <div style={{ fontWeight: 500 }}>{workout.title}</div>
    <div style={{ color: "#1976d2", fontWeight: 500 }}>{formatDistanceOrDuration(workout)}</div>
    {workout.intensityKey && (
      <div style={{ color: "#388e3c", fontWeight: 500 }}>
        Intensität: {intensityLabel || `(${workout.intensityKey})`}
      </div>
    )}
    {workout.notes && <div style={{ color: "#666", fontSize: 13 }}>{workout.notes}</div>}
  </div>
);
