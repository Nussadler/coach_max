import React, { useState } from "react";

interface Interval {
  distance: string;
  pace: string;
  hf: string;
}

interface AdvancedWorkoutLogProps {
  onLog: (payload: {
    warmup: Interval;
    intervals: Interval[];
    cooldown: Interval;
  }) => Promise<void>;
  todayWorkout: string;
  logError?: string;
}

const AdvancedWorkoutLog: React.FC<AdvancedWorkoutLogProps> = ({ onLog, todayWorkout, logError }) => {
  const [warmup, setWarmup] = useState<Interval>({ distance: "", pace: "", hf: "" });
  const [cooldown, setCooldown] = useState<Interval>({ distance: "", pace: "", hf: "" });
  const [intervals, setIntervals] = useState<Interval[]>([{ distance: "", pace: "", hf: "" }]);
  const [success, setSuccess] = useState(false);

  function handleIntervalChange(idx: number, field: keyof Interval, value: string) {
    setIntervals((prev) => prev.map((int, i) => i === idx ? { ...int, [field]: value } : int));
  }

  function addInterval() {
    setIntervals((prev) => [...prev, { distance: "", pace: "", hf: "" }]);
  }

  function removeInterval(idx: number) {
    setIntervals((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    await onLog({ warmup, intervals, cooldown });
    setSuccess(true);
    setWarmup({ distance: "", pace: "", hf: "" });
    setCooldown({ distance: "", pace: "", hf: "" });
    setIntervals([{ distance: "", pace: "", hf: "" }]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: 24, borderRadius: 16, boxShadow: "0 8px 32px rgba(44,62,80,0.12)", minWidth: 0, width: "100%", maxWidth: 370, display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
        <h2 style={{ marginBottom: 24, fontWeight: 700, color: "#2c3e50", fontSize: 28, textAlign: "center" }}>Workout für heute</h2>
        <div style={{ marginBottom: 24, color: "#34495e", fontSize: 18, fontWeight: 500, textAlign: "center", wordBreak: "break-word" }}>{todayWorkout}</div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          <fieldset style={{ border: "none", marginBottom: 12 }}>
            <legend style={{ fontWeight: 600, color: "#2980b9", marginBottom: 8 }}>Warm Up</legend>
            <input type="text" placeholder="Distanz in km" value={warmup.distance} onChange={e => setWarmup({ ...warmup, distance: e.target.value })} required style={{ ...inputStyle }} />
            <input type="text" placeholder="Pace in min/km" value={warmup.pace} onChange={e => setWarmup({ ...warmup, pace: e.target.value })} required style={{ ...inputStyle }} />
            <input type="text" placeholder="Durchschnittliche HF" value={warmup.hf} onChange={e => setWarmup({ ...warmup, hf: e.target.value })} required style={{ ...inputStyle }} />
          </fieldset>
          <fieldset style={{ border: "none", marginBottom: 12 }}>
            <legend style={{ fontWeight: 600, color: "#2980b9", marginBottom: 8 }}>Intervalle</legend>
            {intervals.map((interval, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10, border: "1px solid #c3cfe2", borderRadius: 8, padding: 8, background: "#f5f7fa" }}>
                <div style={{ fontWeight: 500, color: "#34495e", marginBottom: 4 }}>Intervall {idx + 1}</div>
                <input type="text" placeholder="Distanz in km" value={interval.distance} onChange={e => handleIntervalChange(idx, "distance", e.target.value)} required style={{ ...inputStyle }} />
                <input type="text" placeholder="Pace in min/km" value={interval.pace} onChange={e => handleIntervalChange(idx, "pace", e.target.value)} required style={{ ...inputStyle }} />
                <input type="text" placeholder="Durchschnittliche HF" value={interval.hf} onChange={e => handleIntervalChange(idx, "hf", e.target.value)} required style={{ ...inputStyle }} />
                {intervals.length > 1 && (
                  <button type="button" onClick={() => removeInterval(idx)} style={{ background: "#e74c3c", color: "white", border: "none", borderRadius: 6, padding: "4px 8px", marginTop: 4, cursor: "pointer", fontSize: 12 }}>Entfernen</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addInterval} style={{ background: "#27ae60", color: "white", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 6 }}>Intervall hinzufügen</button>
          </fieldset>
          <fieldset style={{ border: "none", marginBottom: 12 }}>
            <legend style={{ fontWeight: 600, color: "#2980b9", marginBottom: 8 }}>Cool Down</legend>
            <input type="text" placeholder="Distanz in km" value={cooldown.distance} onChange={e => setCooldown({ ...cooldown, distance: e.target.value })} required style={{ ...inputStyle }} />
            <input type="text" placeholder="Pace in min/km" value={cooldown.pace} onChange={e => setCooldown({ ...cooldown, pace: e.target.value })} required style={{ ...inputStyle }} />
            <input type="text" placeholder="Durchschnittliche HF" value={cooldown.hf} onChange={e => setCooldown({ ...cooldown, hf: e.target.value })} required style={{ ...inputStyle }} />
          </fieldset>
          <button type="submit" style={{ padding: "12px 0", borderRadius: 8, border: "none", background: "#27ae60", color: "white", fontWeight: 700, fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(44,62,80,0.08)" }}>Workout loggen</button>
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

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #c3cfe2",
  fontSize: 15,
  outline: "none",
  background: "#f5f7fa",
  marginBottom: 4
};

export default AdvancedWorkoutLog;
