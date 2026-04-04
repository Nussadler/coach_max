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
    restingHr?: number;
    maxHr?: number;
}

export type ActivityCategory = 'Threshold' | 'VO2Max' | 'Long Run' | 'Easy Run';

export interface Lap {
    index: number;
    distance: number;    // km
    duration: number;    // seconds
    pace: number;        // min/km
    avgHr: number;       // bpm
    maxHr: number;       // bpm
    avgCadence?: number; // spm
    intensity?: string;  // e.g. "warmup", "active", "cooldown"
}

export interface Activity {
    id: string;
    athleteId: string;
    date: string; // ISO YYYY-MM-DD
    distance: number; // in km
    pace: number; // in min/km
    avgHr: number;
    maxHr: number;
    category: ActivityCategory;
    duration: number; // in seconds
    name: string;
    uploadTimestamp: string; // ISO
    originalFileName: string;
    laps?: Lap[];
}
