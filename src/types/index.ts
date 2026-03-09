export type WorkoutType = 'Intervals' | 'Easy' | 'Long' | 'Strength';

export interface WorkoutStep {
    id: string;
    title: string;
    duration?: string; // e.g., "10 min", "2km"
    pace?: string; // e.g., "5:00 min/km"
    type: 'run' | 'rest' | 'other' | 'repeat';
    repeats?: number;
    subSteps?: WorkoutStep[]; // For complex blocks like "4x(400m fast, 200m slow)"
    // Actuals
    actualDuration?: string;
    actualPace?: string;
    avgHr?: string;
}

export interface Workout {
    id: string;
    athleteId: string;
    coachId?: string;
    title: string;
    date: string; // ISO YYYY-MM-DD
    type: WorkoutType;
    description?: string;
    summary?: {
        distance?: string;
        duration?: string;
    };
    steps: WorkoutStep[];
    performedSteps?: WorkoutStep[]; // The actual steps performed (allowing structural changes)
    completed?: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'athlete' | 'coach';
    coachId?: string;
}
