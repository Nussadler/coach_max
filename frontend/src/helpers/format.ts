// src/helpers/format.ts
import { Workout } from "../data/plan";

export function formatDistanceOrDuration(workout: Workout): string {
  if (workout.distanceKm) return `${workout.distanceKm} km`;
  if (workout.durationMin) return `${workout.durationMin} min`;
  return "";
}
