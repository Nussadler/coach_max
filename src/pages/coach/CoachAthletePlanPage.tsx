import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WeekStrip } from '../../components/WeekStrip/WeekStrip';
import { WorkoutList } from '../../components/WorkoutList/WorkoutList';
import { WorkoutService } from '../../services/workoutService';
import { UserService } from '../../services/userService';
import type { Workout, UserProfile } from '../../types';
import styles from '../Page.module.css'; // Reusing page styles
// We might need specific styles for the "Add" button
import coachStyles from './CoachAthletePlanPage.module.css';

export const CoachAthletePlanPage: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [athlete, setAthlete] = useState<UserProfile | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!athleteId) return;
            setLoading(true);
            try {
                // 1. Load Athlete Profile
                const profile = await UserService.getUserProfile(athleteId);
                setAthlete(profile);

                // 2. Load Workouts
                const startDate = new Date(selectedDate);
                startDate.setDate(startDate.getDate() - 7);
                const endDate = new Date(selectedDate);
                endDate.setDate(endDate.getDate() + 7);

                const allWorkouts = await WorkoutService.getWorkoutsForWeek(
                    athleteId,
                    startDate.toISOString().split('T')[0],
                    endDate.toISOString().split('T')[0]
                );
                setWorkouts(allWorkouts);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [athleteId, selectedDate]);

    const dailyWorkouts = useMemo(() => {
        return workouts.filter(w => w.date === selectedDate);
    }, [workouts, selectedDate]);

    const datesWithWorkouts = useMemo(() => {
        return workouts.map(w => w.date);
    }, [workouts]);

    const handleSelectWorkout = (workoutId: string) => {
        navigate(`/coach/athlete/${athleteId}/workout/${workoutId}`);
    };

    const handleAddWorkout = () => {
        navigate(`/coach/athlete/${athleteId}/workout/new?date=${selectedDate}`);
    };

    const handleBack = () => {
        navigate('/coach');
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <button onClick={handleBack} className={coachStyles.backButton}>← Back</button>
                <h1 className={styles.appTitle}>
                    {athlete?.displayName || 'Athlete'}
                </h1>
                <div className={styles.userAvatar}>
                    {athlete?.displayName?.[0] || 'A'}
                </div>
            </header>

            <div className={styles.stickyWeek}>
                <WeekStrip
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    datesWithWorkouts={datesWithWorkouts}
                />
            </div>

            <main className={styles.mainContent}>
                <div className={coachStyles.actions}>
                    <h2 className={styles.sectionHeading}>
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <button onClick={handleAddWorkout} className={coachStyles.addButton}>
                        + Add Workout
                    </button>
                </div>

                <WorkoutList
                    workouts={dailyWorkouts}
                    onSelectWorkout={handleSelectWorkout}
                    loading={loading}
                />
            </main>
        </div>
    );
};
