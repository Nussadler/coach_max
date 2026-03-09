import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkoutDetailComponent } from '../components/WorkoutDetail/WorkoutDetail';
import { WorkoutService } from '../services/workoutService';
import type { Workout, WorkoutStep } from '../types';
import { useAuth } from '../context/AuthContext';
import styles from './Page.module.css';

export const WorkoutPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const [workout, setWorkout] = useState<Workout | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWorkout = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await WorkoutService.getWorkoutById(id);
                setWorkout(data);
            } catch (error) {
                console.error("Failed to load workout", error);
            } finally {
                setLoading(false);
            }
        };
        loadWorkout();
    }, [id]);

    const handleDelete = async () => {
        if (!workout || !id) return;
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await WorkoutService.deleteWorkout(id);
                navigate(-1);
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete workout");
            }
        }
    };

    const handleEdit = () => {
        if (!workout) return;
        navigate(`/coach/athlete/${workout.athleteId}/workout/${workout.id}/edit`);
    };

    const handleLogWorkout = async (performedSteps: WorkoutStep[]) => {
        if (!workout || !id) return;
        try {
            await WorkoutService.updateWorkout(id, {
                performedSteps,
                completed: true
            });
            // Reload local state to show completed status
            const updated = await WorkoutService.getWorkoutById(id);
            if (updated) setWorkout(updated);
        } catch (error) {
            console.error("Failed to log workout", error);
            alert("Failed to save log");
        }
    };

    const handleCopy = async () => {
        if (!workout) return;
        const newDate = prompt("Enter date for the copy (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
        if (!newDate) return;

        try {
            // Exclude ID and fields we don't want to copy (started/completed status)
            const { id: _, performedSteps, completed, ...workoutData } = workout;

            await WorkoutService.createWorkout({
                ...workoutData,
                date: newDate,
                title: `${workout.title}`,
                completed: false
                // performedSteps is excluded, so it won't be undefined
            } as any);
            alert("Workout copied!");
            navigate(-1);
        } catch (error) {
            console.error("Failed to copy", error);
            alert("Failed to copy workout");
        }
    };

    const handleMove = async () => {
        if (!workout || !id) return;
        const newDate = prompt("Enter new date (YYYY-MM-DD):", workout.date);
        if (!newDate || newDate === workout.date) return;

        try {
            await WorkoutService.updateWorkout(id, { date: newDate });
            setWorkout({ ...workout, date: newDate });
            alert("Workout moved!");
        } catch (error) {
            console.error("Failed to move", error);
            alert("Failed to move workout");
        }
    };

    if (loading) {
        return <div className={styles.loadingPage}>Loading details...</div>;
    }

    if (!workout) {
        return <div className={styles.loadingPage}>Workout not found</div>;
    }

    const isCoach = userRole === 'coach';

    return (
        <div className={styles.pageContainer}>
            <WorkoutDetailComponent
                workout={workout}
                onEdit={isCoach ? handleEdit : undefined}
                onDelete={isCoach ? handleDelete : undefined}
                onLogWorkout={!isCoach ? handleLogWorkout : undefined}
                canLog={!isCoach}
                onCopy={isCoach ? handleCopy : undefined}
                onMove={isCoach ? handleMove : undefined}
            />
        </div>
    );
};
