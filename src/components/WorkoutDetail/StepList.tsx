import React from 'react';
import type { WorkoutStep } from '../../types';
import styles from './StepList.module.css';
import { RefreshCcw, Timer, Activity } from 'lucide-react';

interface StepListProps {
    steps: WorkoutStep[];
    isSubStep?: boolean;
}

export const StepList: React.FC<StepListProps> = ({ steps, isSubStep = false }) => {
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
                            <StepList steps={step.subSteps} isSubStep={true} />
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
                                            <span>{step.pace}</span>
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
