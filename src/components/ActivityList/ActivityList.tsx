import React, { useState } from 'react';
import type { Activity } from '../../types';
import { ActivityDetail } from '../ActivityDetail/ActivityDetail';
import styles from './ActivityList.module.css';

interface ActivityListProps {
    activities: Activity[];
    onDelete: (id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onDelete }) => {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    if (!activities || activities.length === 0) {
        return (
            <div className={styles.emptyState}>
                Noch keine Aktivitäten hochgeladen
            </div>
        );
    }

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatPace = (pace: number) => {
        if (!pace || pace <= 0 || !isFinite(pace)) return '–';
        const mins = Math.floor(pace);
        const secs = Math.round((pace - mins) * 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleDelete = (id: string) => {
        setSelectedActivity(null);
        onDelete(id);
    };

    return (
        <>
            <div className={styles.listContainer}>
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className={styles.activityCard}
                        onClick={() => setSelectedActivity(activity)}
                    >
                        <div className={styles.header}>
                            <h3 className={styles.title}>{activity.name}</h3>
                            <span className={styles.date}>{formatDate(activity.date)}</span>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.stat}>
                                <span className={styles.label}>Kategorie</span>
                                <span className={styles.value}>{activity.category}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.label}>Distanz</span>
                                <span className={styles.value}>{activity.distance.toFixed(2)} km</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.label}>Zeit</span>
                                <span className={styles.value}>{formatDuration(activity.duration)}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.label}>Pace</span>
                                <span className={styles.value}>{formatPace(activity.pace)} /km</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.label}>Avg HR</span>
                                <span className={styles.value}>{activity.avgHr} bpm</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.label}>Max HR</span>
                                <span className={styles.value}>{activity.maxHr} bpm</span>
                            </div>
                        </div>

                        <div className={styles.tapHint}>Tippe für Rundendetails ›</div>
                    </div>
                ))}
            </div>

            {selectedActivity && (
                <ActivityDetail
                    activity={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
};
