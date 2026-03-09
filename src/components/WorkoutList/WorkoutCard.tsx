import React from 'react';
import type { Workout } from '../../types';
import { Card } from '../shared/Card';
import { Badge } from '../shared/Badge';
import { Clock, MapPin } from 'lucide-react';
import styles from './WorkoutCard.module.css';

interface WorkoutCardProps {
    workout: Workout;
    onClick: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick }) => {
    return (
        <Card className={styles.container} onClick={onClick}>
            <div className={styles.header}>
                <h3 className={styles.title}>{workout.title}</h3>
                <Badge type={workout.type} />
            </div>

            {workout.description && (
                <p className={styles.description}>{workout.description}</p>
            )}

            <div className={styles.footer}>
                {workout.summary?.distance && (
                    <div className={styles.stat}>
                        <MapPin size={16} className={styles.icon} />
                        <span>{workout.summary.distance}</span>
                    </div>
                )}
                {workout.summary?.duration && (
                    <div className={styles.stat}>
                        <Clock size={16} className={styles.icon} />
                        <span>{workout.summary.duration}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};
