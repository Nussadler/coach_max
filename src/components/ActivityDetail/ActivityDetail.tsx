import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Activity } from '../../types';
import { ActivityService } from '../../services/activityService';
import styles from './ActivityDetail.module.css';

interface ActivityDetailProps {
    activity: Activity;
    onClose: () => void;
    onDelete: (id: string) => void;
}

export const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity, onClose, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
        return date.toLocaleDateString('de-DE', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getIntensityClass = (intensity?: string) => {
        if (!intensity) return '';
        const lower = intensity.toLowerCase();
        if (lower === 'warmup' || lower === 'warm_up') return styles.intensityWarmup;
        if (lower === 'cooldown' || lower === 'cool_down') return styles.intensityCooldown;
        if (lower === 'rest' || lower === 'recovery') return styles.intensityRest;
        return styles.intensityActive; // active, interval, etc.
    };

    const getIntensityLabel = (intensity?: string) => {
        if (!intensity) return '';
        const lower = intensity.toLowerCase();
        if (lower === 'warmup' || lower === 'warm_up') return 'Aufwärmen';
        if (lower === 'cooldown' || lower === 'cool_down') return 'Auslaufen';
        if (lower === 'rest' || lower === 'recovery') return 'Pause';
        return 'Aktiv';
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await ActivityService.deleteActivity(activity.id);
            onDelete(activity.id);
        } catch (error) {
            console.error("Error deleting activity:", error);
            setDeleting(false);
        }
    };

    const laps = activity.laps || [];

    return (
        <>
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.panel} onClick={e => e.stopPropagation()}>
                    <div className={styles.handle} />

                    <div className={styles.header}>
                        <div className={styles.headerInfo}>
                            <h2 className={styles.title}>{activity.name}</h2>
                            <span className={styles.date}>{formatDate(activity.date)}</span>
                        </div>
                        <button
                            className={styles.deleteButton}
                            onClick={() => setShowConfirm(true)}
                        >
                            <Trash2 size={14} /> Löschen
                        </button>
                    </div>

                    {/* Summary stats */}
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Distanz</span>
                            <span className={styles.summaryValue}>{activity.distance.toFixed(2)} km</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Zeit</span>
                            <span className={styles.summaryValue}>{formatDuration(activity.duration)}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Pace</span>
                            <span className={styles.summaryValue}>{formatPace(activity.pace)} /km</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Avg HR</span>
                            <span className={styles.summaryValue}>{activity.avgHr} bpm</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Max HR</span>
                            <span className={styles.summaryValue}>{activity.maxHr} bpm</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>Kategorie</span>
                            <span className={styles.summaryValue}>{activity.category}</span>
                        </div>
                    </div>

                    {/* Laps table */}
                    <div className={styles.lapsSection}>
                        <h3 className={styles.lapsTitle}>Runden ({laps.length})</h3>

                        {laps.length > 0 ? (
                            <table className={styles.lapsTable}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Dist</th>
                                        <th>Zeit</th>
                                        <th>Pace</th>
                                        <th>Ø HR</th>
                                        <th>Typ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laps.map((lap) => (
                                        <tr key={lap.index}>
                                            <td>{lap.index}</td>
                                            <td>{lap.distance.toFixed(2)} km</td>
                                            <td>{formatDuration(lap.duration)}</td>
                                            <td>{formatPace(lap.pace)}</td>
                                            <td>{lap.avgHr || '–'}</td>
                                            <td>
                                                {lap.intensity && (
                                                    <span className={`${styles.intensityBadge} ${getIntensityClass(lap.intensity)}`}>
                                                        {getIntensityLabel(lap.intensity)}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className={styles.noLaps}>
                                Keine Rundendaten verfügbar
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            {showConfirm && (
                <div className={styles.confirmOverlay} onClick={() => setShowConfirm(false)}>
                    <div className={styles.confirmDialog} onClick={e => e.stopPropagation()}>
                        <p>Möchtest du <strong>{activity.name}</strong> wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                        <div className={styles.confirmActions}>
                            <button
                                className={styles.confirmCancel}
                                onClick={() => setShowConfirm(false)}
                                disabled={deleting}
                            >
                                Abbrechen
                            </button>
                            <button
                                className={styles.confirmDelete}
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Lösche...' : 'Löschen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
