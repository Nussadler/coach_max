import type { Workout, UserProfile } from './index';

export interface WorkoutRepository {
    getWorkoutsForWeek(athleteId: string, startDate: string, endDate: string): Promise<Workout[]>;
    getWorkoutById(id: string): Promise<Workout | undefined>;
    createWorkout(workout: Omit<Workout, 'id'>): Promise<string>;
    updateWorkout(id: string, workout: Partial<Workout>): Promise<void>;
    deleteWorkout(id: string): Promise<void>;
}

export interface UserRepository {
    getAthletes(coachId: string): Promise<UserProfile[]>;
    getUserProfile(uid: string): Promise<UserProfile | undefined>;
    updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void>;
}
