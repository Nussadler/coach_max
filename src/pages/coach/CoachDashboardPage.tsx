import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/userService';
import type { UserProfile } from '../../types';
import styles from './CoachDashboardPage.module.css';

export const CoachDashboardPage: React.FC = () => {
    const { user, userRole } = useAuth();
    const navigate = useNavigate();
    const [athletes, setAthletes] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirect if not coach? Handled by route protection theoretically, 
        // but good to have a check or just proper data fetching restrictions.
        if (userRole !== 'coach') return;

        const loadAthletes = async () => {
            if (!user) return;
            try {
                const myAthletes = await UserService.getAthletes(user.uid);
                setAthletes(myAthletes);
            } catch (error) {
                console.error("Failed to load athletes", error);
            } finally {
                setLoading(false);
            }
        };
        loadAthletes();
    }, [user, userRole]);

    const handleSelectAthlete = (athleteId: string) => {
        navigate(`/coach/athlete/${athleteId}`);
    };

    if (loading) return <div className={styles.loading}>Loading athletes...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Coach Dashboard</h1>
                <div className={styles.coachName}>{user?.email}</div>
            </header>

            <main className={styles.main}>
                <h2 className={styles.sectionTitle}>My Athletes</h2>

                {athletes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No athletes assigned yet.</p>
                        <p className={styles.hint}>Athletes must have your UID set as their coachId.</p>
                        <code className={styles.uid}>{user?.uid}</code>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {athletes.map(athlete => (
                            <div
                                key={athlete.uid}
                                className={styles.athleteCard}
                                onClick={() => handleSelectAthlete(athlete.uid)}
                            >
                                <div className={styles.avatar}>
                                    {athlete.displayName ? athlete.displayName[0].toUpperCase() : athlete.email[0].toUpperCase()}
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.name}>{athlete.displayName || 'Unnamed Athlete'}</h3>
                                    <p className={styles.email}>{athlete.email}</p>
                                </div>
                                <div className={styles.arrow}>→</div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
