import React from "react";

interface WorkoutSwitchProps {
  value: string;
  onChange: (val: string) => void;
}

const WorkoutSwitch: React.FC<WorkoutSwitchProps> = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "24px 0" }}>
    <button
      onClick={() => onChange("z1z2")}
      style={{
        padding: "8px 18px",
        borderRadius: 8,
        border: value === "z1z2" ? "2px solid #2980b9" : "1px solid #c3cfe2",
        background: value === "z1z2" ? "#2980b9" : "#f5f7fa",
        color: value === "z1z2" ? "white" : "#2c3e50",
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer"
      }}
    >
      Z1 & Z2 Workouts
    </button>
    <button
      onClick={() => onChange("longrun")}
      style={{
        padding: "8px 18px",
        borderRadius: 8,
        border: value === "longrun" ? "2px solid #2980b9" : "1px solid #c3cfe2",
        background: value === "longrun" ? "#2980b9" : "#f5f7fa",
        color: value === "longrun" ? "white" : "#2c3e50",
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer"
      }}
    >
      Long Runs
    </button>
    <button
      onClick={() => onChange("interval")}
      style={{
        padding: "8px 18px",
        borderRadius: 8,
        border: value === "interval" ? "2px solid #2980b9" : "1px solid #c3cfe2",
        background: value === "interval" ? "#2980b9" : "#f5f7fa",
        color: value === "interval" ? "white" : "#2c3e50",
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer"
      }}
    >
      Intervalle
    </button>
  </div>
);

export default WorkoutSwitch;
