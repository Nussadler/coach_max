import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { WeekStrip } from '../../components/WeekStrip/WeekStrip';
import { WorkoutList } from '../../components/WorkoutList/WorkoutList';
import { Header } from '../../components/Header/Header';
import { WorkoutService } from '../../services/workoutService';
import { UserService } from '../../services/userService';
import type { Workout, UserProfile } from '../../types';
import styles from '../Page.module.css'; // Reusing page styles
// We might need specific styles for the "Add" button
import coachStyles from './CoachAthletePlanPage.module.css';

export const CoachAthletePlanPage: React.FC = () => {
    const { athleteId } = useParams<{ athleteId: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>(initialDate);

    // Sync selectedDate to URL
    useEffect(() => {
        setSearchParams({ date: selectedDate }, { replace: true });
    }, [selectedDate, setSearchParams]);
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
                const today = new Date();
                const startDate = new Date(today);
                startDate.setDate(today.getDate() - 14); // -2 weeks

                const endDate = new Date(today);
                endDate.setDate(today.getDate() + 42);   // +6 weeks

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
        // Remove selectedDate to prevent refetching
    }, [athleteId]);

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
            <Header
                title={athlete?.displayName || 'Athlete'}
                leftAction={<button onClick={handleBack} className={coachStyles.backButton}>← Back</button>}
            />

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
