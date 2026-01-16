// src/App.tsx
import React, { useState, useEffect } from "react";
import { athletes, AthleteId } from "./data/athletes";
import { weeks } from "./data/plan";
import { AthleteSelector } from "./components/AthleteSelector";
import { WeekGrid } from "./components/WeekGrid";
import { WeekAccordion } from "./components/WeekAccordion";
import { login, auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./components/Login";
import WorkoutLog from "./components/WorkoutLog";
import { addWorkoutLog } from "./firebase";
import ScreenSwitch from "./components/ScreenSwitch";
import WorkoutTable, { WorkoutEntry } from "./components/WorkoutTable";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import AdvancedWorkoutLog from "./components/AdvancedWorkoutLog";
import WorkoutSwitch from "./components/WorkoutSwitch";
import WorkoutTableFull from "./components/WorkoutTableFull";
import IntervalTable from "./components/IntervalTable";
import { FaCalendarAlt, FaListAlt, FaUser } from "react-icons/fa";

const App: React.FC = () => {
  const [selected, setSelected] = useState<AthleteId>("max");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [screen, setScreen] = useState<"plan" | "workouts">("plan");
  const [logError, setLogError] = useState<string | undefined>(undefined);
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [workoutTableType, setWorkoutTableType] = useState("z1z2");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        setEmail(user.email || "");
        // Mapping von E-Mail zu AthleteId
        if (user.email === "max@athlete.de") setSelected("max");
        else if (user.email === "pascal@athlete.de") setSelected("pascal");
        else if (user.email === "hendrik@athlete.de") setSelected("hendrik");
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setEmail("");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchWorkouts() {
      if (!userId) {
        console.log("[DEBUG] Kein userId vorhanden, Tabelle wird geleert.");
        setWorkoutEntries([]);
        setLoadingEntries(false);
        return;
      }
      setLoadingEntries(true);
      try {
        console.log(`[DEBUG] Lade Workouts für userId: ${userId}`);
        const q = query(
          collection(db, "workout_logs"),
          where("userId", "==", userId)
        );
        const snap = await getDocs(q);
        console.log(`[DEBUG] Anzahl geladener Dokumente: ${snap.size}`);
        const entries: WorkoutEntry[] = [];
        snap.forEach(doc => {
          const d = doc.data();
          console.log("[DEBUG] Dokumentdaten:", d);
          entries.push({
            date: d.date,
            workout: d.workout,
            distance: d.distance ?? "",
            pace: d.pace ?? "",
            hf: d.hf ?? "",
            warmup: d.warmup ?? undefined,
            intervals: d.intervals ?? undefined,
            cooldown: d.cooldown ?? undefined,
          });
        });
        console.log(`[DEBUG] Workouts nach Filter:`, entries);
        entries.sort((a, b) => {
          const da = a.date.split(".").reverse().join("");
          const db = b.date.split(".").reverse().join("");
          return db.localeCompare(da);
        });
        setWorkoutEntries(entries);
      } catch (e) {
        console.error("[DEBUG] Fehler beim Laden der Workouts:", e);
        setWorkoutEntries([]);
      }
      setLoadingEntries(false);
    }
    if (screen === "workouts" && userId) {
      fetchWorkouts();
    } else if (screen === "workouts") {
      setWorkoutEntries([]);
      setLoadingEntries(false);
    }
  }, [screen, userId]);

  async function handleLogin(eOrEmail: React.FormEvent | string, password?: string) {
    if (typeof eOrEmail === "object") {
      // legacy fallback
      eOrEmail.preventDefault();
      return;
    }
    try {
      await login(eOrEmail, password!);
      setIsLoggedIn(true);
      setLoginError(undefined);
    } catch (err) {
      setLoginError("Login fehlgeschlagen");
    }
  }

  function handleLogout() {
    signOut(auth);
  }

  // Nur den passenden Athlete anzeigen
  const athlete = athletes.find((a) => a.id === selected)!;

  // Zeige AthleteSelector nur für max@coach.de
  const showSelector = email === "max@coach.de";

  // Ermittle das heutige Workout für den eingeloggten Athlete
  const today = new Date();
  const todayStr = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
  const todayPlan = weeks
    .flatMap((w) => w.days)
    .find((d) => d.date === todayStr);
  let todayWorkout = "Kein Workout für heute.";
  if (todayPlan) {
    const override = todayPlan.athleteOverrides?.[selected];
    todayWorkout = override?.run || override?.bike || override?.strength || todayPlan.run || todayPlan.bike || todayPlan.strength || todayWorkout;
  }

  function isAdvancedWorkout(name: string) {
    return /Threshold|VO2Max/i.test(name);
  }

  async function handleWorkoutLog(payload: { distance: string; pace: string; hf: string }) {
    setLogError(undefined);
    try {
      await addWorkoutLog({
        date: todayStr,
        workout: todayWorkout,
        distance: payload.distance,
        pace: payload.pace,
        hf: payload.hf,
      });
    } catch (err) {
      setLogError("Fehler beim Speichern des Workouts");
    }
  }

  async function handleAdvancedWorkoutLog(payload: { warmup: any; intervals: any[]; cooldown: any }) {
    setLogError(undefined);
    try {
      await addWorkoutLog({
        date: todayStr,
        workout: todayWorkout,
        warmup: payload.warmup,
        intervals: payload.intervals,
        cooldown: payload.cooldown,
      });
    } catch (err) {
      setLogError("Fehler beim Speichern des Workouts");
    }
  }

  // Filter Workouts nach Typ
  const z1z2Entries = workoutEntries.filter(e => /Easy|Recovery/i.test(e.workout));
  const longRunEntries = workoutEntries.filter(e => /Long Run/i.test(e.workout));
  const intervalEntries = workoutEntries.filter(e => /Threshold|VO2Max|Intervall/i.test(e.workout));

  // Ermittle, ob für heute schon ein Workout geloggt wurde
  const todaysLoggedWorkout = workoutEntries.find(e => e.date === todayStr);

  // Hilfsfunktion für Workout-Farbe (wie im Plan)
  function getWorkoutBgColor(workout: string) {
    const firstLine = (workout || "").split("\n")[0].toLowerCase();
    if (firstLine.includes("gym")) return "#f3eaff"; // pastell-lila für Gym
    if (firstLine.includes("recovery") || firstLine.includes("rest")) return "#f3f3f3"; // hellgrau
    if (firstLine.includes("easy")) return "#e6f7e6"; // pastell grün
    if (firstLine.includes("base")) return "#e6f7e6"; // pastell grün
    if (firstLine.includes("threshold")) return "#fff4e0"; // pastell orange
    if (firstLine.includes("10k")) return "#fff4e0"; // pastell orange
    if (firstLine.includes("vo2max")) return "#ffeaea"; // pastell rot
    if (firstLine.includes("long run")) return "#e6f0fa"; // pastell blau
    return "#fff";
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", background: "#f5f7fa", minHeight: "100vh", padding: 0, margin: 0, position: "relative" }}>
      <header style={{ padding: 32, textAlign: "center", position: "relative" }}>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 32 }}>Coach Maxi</h1>
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24, paddingBottom: 90 }}>
        {showProfile ? (
          <div style={{ background: "white", padding: 24, borderRadius: 16, boxShadow: "0 8px 32px rgba(44,62,80,0.12)", maxWidth: 370, margin: "0 auto", marginBottom: 32, boxSizing: "border-box", textAlign: "center" }}>
            <h2 style={{ fontWeight: 700, color: "#2c3e50", fontSize: 24, marginBottom: 16 }}>Profil</h2>
            <div style={{ fontSize: 18, marginBottom: 12 }}>Angemeldet als:</div>
            <div style={{ fontWeight: 600, color: "#2980b9", fontSize: 18, marginBottom: 24 }}>{email}</div>
            <button onClick={handleLogout} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#e74c3c", color: "white", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Logout</button>
            <div style={{ marginTop: 24 }}>
              <button onClick={() => setShowProfile(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #c3cfe2", background: "#f5f7fa", color: "#2c3e50", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Zurück</button>
            </div>
          </div>
        ) : screen === "plan" ? (
          <>
            {/* AthleteSelector nur für max@coach.de */}
            {email === "max@coach.de" && (
              <AthleteSelector athletes={athletes} selected={selected} onSelect={setSelected} />
            )}
            {weeks.map((week, idx) => (
              <WeekAccordion
                key={week.title}
                title={week.title}
                defaultOpen={idx === 0}
              >
                <WeekGrid week={week.days} athlete={athlete} />
              </WeekAccordion>
            ))}
          </>
        ) : (
          <>
            {/* Workout Logging und Übersicht */}
            {/* Ermittle, ob für heute schon ein Workout geloggt wurde */}
            {todaysLoggedWorkout ? (
              <div style={{ background: getWorkoutBgColor(todaysLoggedWorkout.workout), padding: 24, borderRadius: 16, boxShadow: "0 8px 32px rgba(44,62,80,0.12)", minWidth: 0, width: "100%", maxWidth: 370, margin: "0 auto", marginBottom: 32, boxSizing: "border-box" }}>
                <h2 style={{ marginBottom: 16, fontWeight: 700, color: "#2c3e50", fontSize: 24, textAlign: "center" }}>
                  <span role="img" aria-label="party">🥳</span>Dein heutiges Workout<span role="img" aria-label="party">🥳</span>
                </h2>
                <div style={{ color: "#34495e", fontSize: 18, fontWeight: 500, textAlign: "center", wordBreak: "break-word", whiteSpace: "pre-line", marginBottom: 12 }}>{todaysLoggedWorkout.workout}</div>
                {todaysLoggedWorkout.distance && <div style={{ fontWeight: 600 }}><span>Distanz:</span> <span style={{ fontWeight: 400 }}>{todaysLoggedWorkout.distance} km</span></div>}
                {todaysLoggedWorkout.pace && <div style={{ fontWeight: 600 }}><span>Pace:</span> <span style={{ fontWeight: 400 }}>{todaysLoggedWorkout.pace} min/km</span></div>}
                {todaysLoggedWorkout.hf && <div style={{ fontWeight: 600 }}><span>Ø HF:</span> <span style={{ fontWeight: 400 }}>{todaysLoggedWorkout.hf}</span></div>}
                {/* Advanced Felder anzeigen, falls vorhanden */}
                {todaysLoggedWorkout.warmup && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 600, color: "#2980b9" }}>Warm Up</div>
                    <div>Distanz: {todaysLoggedWorkout.warmup.distance} km</div>
                    <div>Pace: {todaysLoggedWorkout.warmup.pace} min/km</div>
                    <div>Ø HF: {todaysLoggedWorkout.warmup.hf}</div>
                  </div>
                )}
                {Array.isArray(todaysLoggedWorkout.intervals) && todaysLoggedWorkout.intervals.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 600, color: "#2980b9" }}>Intervalle</div>
                    {todaysLoggedWorkout.intervals.map((int, i) => (
                      <div key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
                        <div style={{ fontWeight: 500 }}>Intervall {i + 1}</div>
                        <div>Distanz: {int.distance} km</div>
                        <div>Pace: {int.pace} min/km</div>
                        <div>Ø HF: {int.hf}</div>
                      </div>
                    ))}
                  </div>
                )}
                {todaysLoggedWorkout.cooldown && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 600, color: "#2980b9" }}>Cool Down</div>
                    <div>Distanz: {todaysLoggedWorkout.cooldown.distance} km</div>
                    <div>Pace: {todaysLoggedWorkout.cooldown.pace} min/km</div>
                    <div>Ø HF: {todaysLoggedWorkout.cooldown.hf}</div>
                  </div>
                )}
              </div>
            ) : (
              isAdvancedWorkout(todayWorkout) ? (
                <AdvancedWorkoutLog onLog={handleAdvancedWorkoutLog} todayWorkout={todayWorkout} logError={logError} />
              ) : (
                <WorkoutLog onLog={handleWorkoutLog} todayWorkout={todayWorkout} logError={logError} />
              )
            )}
            <WorkoutSwitch value={workoutTableType} onChange={setWorkoutTableType} />
            {workoutTableType === "z1z2" && <WorkoutTableFull entries={z1z2Entries} title="Z1 & Z2 Workouts" />}
            {workoutTableType === "longrun" && <WorkoutTableFull entries={longRunEntries} title="Long Runs" />}
            {workoutTableType === "interval" && <IntervalTable entries={intervalEntries} />}
          </>
        )}
      </main>
      {/* Bottom Navigation */}
      <nav style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff", borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "space-around", alignItems: "center", height: 64, zIndex: 100 }}>
        <button onClick={() => { setShowProfile(false); setScreen("plan"); }} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", color: screen === "plan" && !showProfile ? "#2980b9" : "#888", fontWeight: 600, fontSize: 13, flex: 1, cursor: "pointer" }}>
          <FaCalendarAlt size={24} style={{ marginBottom: 2 }} />
          Plan
        </button>
        <button onClick={() => { setShowProfile(false); setScreen("workouts"); }} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", color: screen === "workouts" && !showProfile ? "#2980b9" : "#888", fontWeight: 600, fontSize: 13, flex: 1, cursor: "pointer" }}>
          <FaListAlt size={24} style={{ marginBottom: 2 }} />
          Workouts
        </button>
        <button onClick={() => setShowProfile(true)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", color: showProfile ? "#2980b9" : "#888", fontWeight: 600, fontSize: 13, flex: 1, cursor: "pointer" }}>
          <FaUser size={24} style={{ marginBottom: 2 }} />
          Profil
        </button>
      </nav>
    </div>
  );
};

export default App;
