import { signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVlpwKJTE0RGMF4U3F1wuRCgNn-q9KWgw",
  authDomain: "coach-max-a6dee.firebaseapp.com",
  projectId: "coach-max-a6dee",
  storageBucket: "coach-max-a6dee.firebasestorage.app",
  messagingSenderId: "490974771173",
  appId: "1:490974771173:web:465ff918c0c1772652610c",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Login-Funktion
export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  console.log("UID:", cred.user.uid); // <- DAS ist die UID
  return cred.user;
}

// Workout-Log-Funktion
export async function addWorkoutLog(payload: { date: string; workout: string; distance?: string; pace?: string; hf?: string; warmup?: any; intervals?: any[]; cooldown?: any }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  try {
    await addDoc(collection(db, "workout_logs"), {
      userId: user.uid,
      date: payload.date,
      workout: payload.workout,
      distance: payload.distance ?? null,
      pace: payload.pace ?? null,
      hf: payload.hf ?? null,
      warmup: payload.warmup ?? null,
      intervals: payload.intervals ?? null,
      cooldown: payload.cooldown ?? null,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("[DEBUG] Fehler beim Speichern des Workouts:", err);
    throw err;
  }
}
