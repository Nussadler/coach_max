import React from 'react';
import type { WorkoutStep, UserProfile } from '../../types';
import styles from './StepList.module.css';
import { RefreshCcw, Timer, Activity } from 'lucide-react';

interface StepListProps {
    steps: WorkoutStep[];
    isSubStep?: boolean;
    athleteProfile?: UserProfile;
}

const getZoneDisplay = (pace: string, profile?: UserProfile) => {
    if (!profile || !profile.restingHr || !profile.maxHr || !/^Zone [1-5]$/.test(pace)) {
        return pace; // Return original if not a zone or no HR data
    }
    
    // Karvonen formula
    const rHR = profile.restingHr;
    const mHR = profile.maxHr;
    const hrr = mHR - rHR;
    
    const zoneMultipliers: Record<string, [number, number]> = {
        'Zone 1': [0.5, 0.6],
        'Zone 2': [0.6, 0.7],
        'Zone 3': [0.7, 0.8],
        'Zone 4': [0.8, 0.9],
        'Zone 5': [0.9, 1.0],
    };

    const minPct = zoneMultipliers[pace][0];
    const maxPct = zoneMultipliers[pace][1];
    
    const minHR = Math.round(hrr * minPct + rHR);
    const maxHR = Math.round(hrr * maxPct + rHR);
    
    return `${pace} (${minHR}-${maxHR} bpm)`;
};

export const StepList: React.FC<StepListProps> = ({ steps, isSubStep = false, athleteProfile }) => {
    return (
        <div className={isSubStep ? styles.subList : styles.list}>
            {steps.map((step) => (
                <React.Fragment key={step.id}>
                    {step.type === 'repeat' && step.subSteps ? (
                        <div className={styles.repeatBlock}>
                            <div className={styles.repeatHeader}>
                                <RefreshCcw size={14} className={styles.repeatIcon} />
                                <span className={styles.repeatCount}>{step.repeats}x Sets</span>
                                {step.title && <span className={styles.repeatTitle}>- {step.title}</span>}
                            </div>
                            <StepList steps={step.subSteps} isSubStep={true} athleteProfile={athleteProfile} />
                        </div>
                    ) : (
                        <div className={`${styles.step} ${styles[step.type]}`}>
                            <div className={styles.stepContent}>
                                <div className={styles.stepTitleRow}>
                                    <span className={styles.stepTitle}>{step.title}</span>
                                    <span className={styles.stepTypeBadge}>{step.type.toUpperCase()}</span>
                                </div>
                                <div className={styles.stepDetails}>
                                    {step.duration && (
                                        <div className={styles.detailItem}>
                                            <Timer size={14} />
                                            <span>{step.duration}</span>
                                        </div>
                                    )}
                                    {step.pace && (
                                        <div className={styles.detailItem}>
                                            <Activity size={14} />
                                            <span>{getZoneDisplay(step.pace, athleteProfile)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
