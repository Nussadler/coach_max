// src/components/AthleteSelector.tsx
import React from "react";
import { Athlete, AthleteId } from "../data/athletes";

interface AthleteSelectorProps {
  athletes: Athlete[];
  selected: AthleteId;
  onSelect: (id: AthleteId) => void;
}

export const AthleteSelector: React.FC<AthleteSelectorProps> = ({ athletes, selected, onSelect }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
    {athletes.map((athlete) => (
      <button
        key={athlete.id}
        onClick={() => onSelect(athlete.id)}
        style={{
          padding: "8px 20px",
          borderRadius: 20,
          border: selected === athlete.id ? "2px solid #1976d2" : "1px solid #ccc",
          background: selected === athlete.id ? "#e3f2fd" : "#fff",
          fontWeight: selected === athlete.id ? 600 : 400,
          cursor: "pointer"
        }}
      >
        {athlete.displayName}
      </button>
    ))}
  </div>
);
