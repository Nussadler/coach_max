import React from 'react';
import type { Workout } from '../../types';
import { WorkoutCard } from './WorkoutCard';
import { Coffee } from 'lucide-react';
import styles from './WorkoutList.module.css';

interface WorkoutListProps {
    workouts: Workout[];
    onSelectWorkout: (id: string) => void;
    loading?: boolean;
}

export const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onSelectWorkout, loading }) => {
    if (loading) {
        return <div className={styles.loading}>Loading schedule...</div>;
    }

    if (workouts.length === 0) {
        return (
            <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                    <Coffee size={40} />
                </div>
                <h3>Rest Day</h3>
                <p>No workouts scheduled. Enjoy your recovery!</p>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {workouts.map((workout) => (
                <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onClick={() => onSelectWorkout(workout.id)}
                />
            ))}
        </div>
    );
};
