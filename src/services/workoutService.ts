import type { Workout } from '../types';
import { FirestoreWorkoutRepository } from './firestoreWorkoutRepository';

// In a real app, we might use dependency injection or environment flags
// to switch between Mock and Firestore repositories.
const repository = FirestoreWorkoutRepository;

export const WorkoutService = {
    getWorkoutsForWeek: async (athleteId: string, startDate: string, endDate: string): Promise<Workout[]> => {
        return repository.getWorkoutsForWeek(athleteId, startDate, endDate);
    },

    getWorkoutById: async (id: string): Promise<Workout | undefined> => {
        return repository.getWorkoutById(id);
    },

    createWorkout: async (workout: Omit<Workout, 'id'>): Promise<string> => {
        return repository.createWorkout(workout);
    },

    updateWorkout: async (id: string, workout: Partial<Workout>): Promise<void> => {
        return repository.updateWorkout(id, workout);
    },

    deleteWorkout: async (id: string): Promise<void> => {
        return repository.deleteWorkout(id);
    }
};
