import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WeekStrip } from '../components/WeekStrip/WeekStrip';
import { WorkoutList } from '../components/WorkoutList/WorkoutList';
import { WorkoutService } from '../services/workoutService';
import type { Workout } from '../types';
import styles from './Page.module.css';

export const PlanPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Now using user from hook
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWorkouts = async () => {
            if (!user) return; // Wait for user

            setLoading(true);
            try {
                // Fetch workouts for a 2-week range around selected date
                const startDate = new Date(selectedDate);
                startDate.setDate(startDate.getDate() - 7);
                const endDate = new Date(selectedDate);
                endDate.setDate(endDate.getDate() + 7);

                const allWorkouts = await WorkoutService.getWorkoutsForWeek(
                    user.uid,
                    startDate.toISOString().split('T')[0],
                    endDate.toISOString().split('T')[0]
                );
                setWorkouts(allWorkouts);
            } catch (error) {
                console.error("Failed to load workouts", error);
            } finally {
                setLoading(false);
            }
        };
        loadWorkouts();
    }, [selectedDate, user]);

    // Filter workouts for the selected date
    const dailyWorkouts = useMemo(() => {
        return workouts.filter(w => w.date === selectedDate);
    }, [workouts, selectedDate]);

    // Get list of dates that have workouts for the dot indicator
    const datesWithWorkouts = useMemo(() => {
        return workouts.map(w => w.date);
    }, [workouts]);

    const handleSelectWorkout = (id: string) => {
        navigate(`/workout/${id}`);
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.appTitle}>Coach Max</h1>
                <div className={styles.userAvatar}>MK</div>
            </header>

            <div className={styles.stickyWeek}>
                <WeekStrip
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    datesWithWorkouts={datesWithWorkouts}
                />
            </div>

            <main className={styles.mainContent}>
                <h2 className={styles.sectionHeading}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <WorkoutList
                    workouts={dailyWorkouts}
                    onSelectWorkout={handleSelectWorkout}
                    loading={loading}
                />
            </main>
        </div>
    );
};
