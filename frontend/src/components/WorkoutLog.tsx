import React, { useState } from "react";

interface WorkoutLogProps {
  onLog: (payload: { distance: string; pace: string; hf: string }) => Promise<void>;
  todayWorkout: string;
  logError?: string;
}

const WorkoutLog: React.FC<WorkoutLogProps> = ({ onLog, todayWorkout, logError }) => {
  const [distance, setDistance] = useState("");
  const [pace, setPace] = useState("");
  const [hf, setHf] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    await onLog({ distance, pace, hf });
    setSuccess(true);
    setDistance("");
    setPace("");
    setHf("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: 24, borderRadius: 16, boxShadow: "0 8px 32px rgba(44,62,80,0.12)", minWidth: 0, width: "100%", maxWidth: 370, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
        <h2 style={{ marginBottom: 24, fontWeight: 700, color: "#2c3e50", fontSize: 28, textAlign: "center" }}>Workout für heute</h2>
        <div style={{ marginBottom: 24, color: "#34495e", fontSize: 18, fontWeight: 500, textAlign: "center", wordBreak: "break-word" }}>{todayWorkout}</div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          <input
            type="text"
            placeholder="Distanz in km"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            required
            style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #c3cfe2", fontSize: 16, outline: "none", background: "#f5f7fa" }}
          />
          <input
            type="text"
            placeholder="Pace in min/km"
            value={pace}
            onChange={e => setPace(e.target.value)}
            required
            style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #c3cfe2", fontSize: 16, outline: "none", background: "#f5f7fa" }}
          />
          <input
            type="text"
            placeholder="Durchschnittliche HF"
            value={hf}
            onChange={e => setHf(e.target.value)}
            required
            style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #c3cfe2", fontSize: 16, outline: "none", background: "#f5f7fa" }}
          />
          <button
            type="submit"
            style={{ padding: "12px 0", borderRadius: 8, border: "none", background: "#27ae60", color: "white", fontWeight: 700, fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(44,62,80,0.08)" }}
          >
            Workout loggen
          </button>
        </form>
        {success && <div style={{ color: "#27ae60", marginTop: 16 }}>Erfolgreich gespeichert!</div>}
        {logError && <div style={{ color: "#e74c3c", marginTop: 16 }}>{logError}</div>}
      </div>
      <div style={{ marginTop: 32, color: "#7f8c8d", fontSize: 14 }}>
        <span>Halbmarathon Trainingsplan Coach OS</span>
      </div>
    </div>
  );
};

export default WorkoutLog;
