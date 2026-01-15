// src/helpers/resolveWorkout.ts
import { Workout, workoutDefaults } from "../data/plan";

export function resolveWorkout(workout: Workout): Workout {
  const defaults = workoutDefaults[workout.type] || {};
  return { ...defaults, ...workout };
}
