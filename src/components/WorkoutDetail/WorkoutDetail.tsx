import React, { useState } from 'react';
import type { Workout, WorkoutStep } from '../../types';
import { StepList } from './StepList';
import { Badge } from '../shared/Badge';
import { ChevronLeft, Calendar, FileText, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './WorkoutDetail.module.css';
import { WorkoutLogger } from './WorkoutLogger';

interface WorkoutDetailComponentProps {
    workout: Workout;
    onEdit?: () => void;
    onDelete?: () => void;
    onLogWorkout?: (performedSteps: WorkoutStep[]) => Promise<void>;
    canLog?: boolean;
    onCopy?: () => void;
    onMove?: () => void;
}

export const WorkoutDetailComponent: React.FC<WorkoutDetailComponentProps> = ({
    workout,
    onEdit,
    onDelete,
    onLogWorkout,
    canLog = false,
    onCopy,
    onMove
}) => {
    const navigate = useNavigate();
    const [isLogging, setIsLogging] = useState(false);

    if (isLogging && onLogWorkout) {
        return (
            <WorkoutLogger
                workout={workout}
                onSave={async (steps) => {
                    await onLogWorkout(steps);
                    setIsLogging(false);
                }}
                onCancel={() => setIsLogging(false)}
            />
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <ChevronLeft size={24} />
                    <span>Back</span>
                </button>
                <div className={styles.actions}>
                    {canLog && !workout.completed && (
                        <button onClick={() => setIsLogging(true)} className={styles.logButton}>
                            <PlayCircle size={16} /> Log Workout
                        </button>
                    )}
                    {(onEdit || onDelete) && (
                        <>
                            {onCopy && <button onClick={onCopy} className={styles.actionButton}>Copy</button>}
                            {onMove && <button onClick={onMove} className={styles.actionButton}>Move</button>}
                            {onEdit && <button onClick={onEdit} className={styles.editButton}>Edit</button>}
                            {onDelete && <button onClick={onDelete} className={styles.deleteButton}>Delete</button>}
                        </>
                    )}
                </div>
            </div>

            <div className={styles.titleSection}>
                <div className={styles.topRow}>
                    <span className={styles.date}>
                        <Calendar size={14} /> {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    <Badge type={workout.type} />
                </div>
                <h1 className={styles.title}>{workout.title}</h1>

                {workout.description && (
                    <div className={styles.description}>
                        <FileText size={16} className={styles.descIcon} />
                        <p>{workout.description}</p>
                    </div>
                )}
            </div>

            <div className={styles.stepsSection}>
                <h2 className={styles.sectionTitle}>
                    {workout.completed ? "Performed Workout" : "Structure"}
                </h2>
                <StepList steps={workout.performedSteps || workout.steps} />
            </div>
        </div>
    );
};
