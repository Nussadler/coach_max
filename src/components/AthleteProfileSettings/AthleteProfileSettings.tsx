import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import type { UserProfile } from '../../types';
import { UserService } from '../../services/userService';
import styles from './AthleteProfileSettings.module.css';

interface AthleteProfileSettingsProps {
    athleteId: string;
    // Allow supplying the profile directly (useful if already fetched),
    // otherwise we fetch it or at least sync up.
    initialProfile?: UserProfile;
}

export const AthleteProfileSettings: React.FC<AthleteProfileSettingsProps> = ({ athleteId, initialProfile }) => {
    const [profile, setProfile] = useState<UserProfile | undefined>(initialProfile);
    const [restingHr, setRestingHr] = useState<string>(initialProfile?.restingHr?.toString() || '');
    const [maxHr, setMaxHr] = useState<string>(initialProfile?.maxHr?.toString() || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!initialProfile && athleteId) {
            UserService.getUserProfile(athleteId).then(p => {
                if (p) {
                    setProfile(p);
                    if (p.restingHr) setRestingHr(p.restingHr.toString());
                    if (p.maxHr) setMaxHr(p.maxHr.toString());
                }
            });
        }
    }, [athleteId, initialProfile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        
        try {
            const rHR = restingHr ? parseInt(restingHr, 10) : undefined;
            const mHR = maxHr ? parseInt(maxHr, 10) : undefined;
            
            await UserService.updateUserProfile(athleteId, {
                restingHr: rHR,
                maxHr: mHR
            });
            
            setMessage({ type: 'success', text: 'Profil erfolgreich gespeichert!' });
            
            // update local copy
            if (profile) {
                setProfile({ ...profile, restingHr: rHR, maxHr: mHR });
            }
        } catch (error) {
            console.error("Save error: ", error);
            setMessage({ type: 'error', text: 'Fehler beim Speichern' });
        } finally {
            setSaving(false);
        }
    };

    const renderZones = () => {
        const rHR = parseInt(restingHr, 10);
        const mHR = parseInt(maxHr, 10);
        
        if (!rHR || !mHR || rHR >= mHR || mHR < 100 || rHR < 30) {
            return (
                <div className={styles.noZones}>
                    Bitte gib realistische Werte für Ruhe-Puls und Max-Puls ein, um die Herzfrequenz-Zonen zu berechnen.
                </div>
            );
        }

        const hrr = mHR - rHR; // Heart Rate Reserve
        
        // Karvonen formula: Zone = (HRR * intensity%) + rHR
        const zones = [
            { name: 'Zone 1 (Regeneration)', minPct: 0.5, maxPct: 0.6, color: '#3b82f6' },
            { name: 'Zone 2 (GA1 - Grundlage)', minPct: 0.6, maxPct: 0.7, color: '#22c55e' },
            { name: 'Zone 3 (GA2 - Tempo)', minPct: 0.7, maxPct: 0.8, color: '#eab308' },
            { name: 'Zone 4 (Schwelle)', minPct: 0.8, maxPct: 0.9, color: '#f97316' },
            { name: 'Zone 5 (VO2Max / Anaerob)', minPct: 0.9, maxPct: 1.0, color: '#ef4444' },
        ];

        return (
            <div className={styles.zonesContainer}>
                <h3 className={styles.zonesTitle}>Deine HF-Zonen (Karvonen)</h3>
                <div className={styles.zonesList}>
                    {zones.map((z, i) => {
                        const minHR = Math.round((hrr * z.minPct) + rHR);
                        const maxHR = Math.round((hrr * z.maxPct) + rHR);
                        return (
                            <div key={i} className={styles.zoneItem}>
                                <div className={styles.zoneColor} style={{ backgroundColor: z.color }}>Z{i+1}</div>
                                <div className={styles.zoneInfo}>
                                    <span className={styles.zoneName}>{z.name}</span>
                                    <span className={styles.zoneRange}>{minHR} - {maxHR} bpm</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <User size={24} className={styles.headerIcon} />
                <h2 className={styles.title}>Athleten-Profil</h2>
            </div>
            
            <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Ruhe-Puls (bpm)</label>
                    <input 
                        type="number" 
                        value={restingHr}
                        onChange={(e) => setRestingHr(e.target.value)}
                        placeholder="z.B. 50"
                        min="30"
                        max="120"
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Maximal-Puls (bpm)</label>
                    <input 
                        type="number" 
                        value={maxHr}
                        onChange={(e) => setMaxHr(e.target.value)}
                        placeholder="z.B. 190"
                        min="100"
                        max="240"
                    />
                </div>
                
                <button type="submit" disabled={saving} className={styles.saveButton}>
                    {saving ? 'Speichere...' : 'Speichern'}
                </button>
                
                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}
            </form>

            <div className={styles.divider} />
            
            {renderZones()}
        </div>
    );
};
