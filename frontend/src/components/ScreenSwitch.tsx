import React from "react";

interface ScreenSwitchProps {
  screen: "plan" | "workouts";
  setScreen: (screen: "plan" | "workouts") => void;
}

const ScreenSwitch: React.FC<ScreenSwitchProps> = ({ screen, setScreen }) => (
  <div style={{ display: "flex", gap: 16, justifyContent: "center", margin: "24px 0" }}>
    <button
      onClick={() => setScreen("plan")}
      style={{
        padding: "10px 24px",
        borderRadius: 8,
        border: screen === "plan" ? "2px solid #2980b9" : "1px solid #c3cfe2",
        background: screen === "plan" ? "#2980b9" : "#f5f7fa",
        color: screen === "plan" ? "white" : "#2c3e50",
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer"
      }}
    >
      Plan
    </button>
    <button
      onClick={() => setScreen("workouts")}
      style={{
        padding: "10px 24px",
        borderRadius: 8,
        border: screen === "workouts" ? "2px solid #2980b9" : "1px solid #c3cfe2",
        background: screen === "workouts" ? "#2980b9" : "#f5f7fa",
        color: screen === "workouts" ? "white" : "#2c3e50",
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer"
      }}
    >
      Meine Workouts
    </button>
  </div>
);

export default ScreenSwitch;
