import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { parseFitFile } from '../../utils/fitParser';
import { ActivityService } from '../../services/activityService';
import type { Activity } from '../../types';
import styles from './ActivityUpload.module.css';

interface ActivityUploadProps {
    athleteId: string;
    onUploadSuccess: (activity: Activity) => void;
}

export const ActivityUpload: React.FC<ActivityUploadProps> = ({ athleteId, onUploadSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (!file.name.toLowerCase().endsWith('.fit')) {
            setError('Bitte lade eine gültige .fit Datei hoch.');
            return;
        }

        setLoading(true);

        try {
            const buffer = await file.arrayBuffer();

            // 1. Parse FIT file
            const parsedData = await parseFitFile(buffer);

            // 2. Map to Activity
            const newActivity: Omit<Activity, 'id'> = {
                athleteId,
                date: parsedData.date,
                distance: parsedData.distance,
                pace: parsedData.pace,
                avgHr: parsedData.avgHr,
                maxHr: parsedData.maxHr,
                category: parsedData.category,
                duration: parsedData.duration,
                name: parsedData.name,
                uploadTimestamp: new Date().toISOString(),
                originalFileName: file.name,
                laps: parsedData.laps,
            };

            // 3. Save to Firebase
            const id = await ActivityService.createActivity(newActivity);

            // 4. Update UI
            onUploadSuccess({ id, ...newActivity });

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError('Fehler beim Verarbeiten oder Hochladen der Datei.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <input
                type="file"
                accept=".fit"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={loading}
            />
            <button
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
            >
                <Upload size={20} />
                {loading ? 'Verarbeite FIT...' : '.fit Workout hochladen'}
            </button>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};
