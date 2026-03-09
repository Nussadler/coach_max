import React, { useState } from 'react';
import type { Workout, WorkoutStep } from '../../types';
import styles from './WorkoutLogger.module.css';
import { Trash2, Save, X, RefreshCcw } from 'lucide-react';

interface WorkoutLoggerProps {
    workout: Workout;
    onSave: (performedSteps: WorkoutStep[]) => void;
    onCancel: () => void;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ workout, onSave, onCancel }) => {
    // Initialize with performedSteps if they exist, otherwise copy planned steps
    // We do a deep copy to ensure we don't mutate original plan in UI before saving
    const [steps, setSteps] = useState<WorkoutStep[]>(
        JSON.parse(JSON.stringify(workout.performedSteps || workout.steps || []))
    );
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave(steps);
        setSaving(false);
    };

    // Recursive update helper
    const updateStepRecursive = (
        currentSteps: WorkoutStep[],
        id: string,
        updates: Partial<WorkoutStep>
    ): WorkoutStep[] => {
        return currentSteps.map(step => {
            if (step.id === id) {
                return { ...step, ...updates };
            }
            if (step.subSteps) {
                return { ...step, subSteps: updateStepRecursive(step.subSteps, id, updates) };
            }
            return step;
        });
    };

    const updateStep = (id: string, updates: Partial<WorkoutStep>) => {
        setSteps(prev => updateStepRecursive(prev, id, updates));
    };

    // Recursive delete helper
    const deleteStepRecursive = (currentSteps: WorkoutStep[], id: string): WorkoutStep[] => {
        return currentSteps.filter(step => step.id !== id).map(step => ({
            ...step,
            subSteps: step.subSteps ? deleteStepRecursive(step.subSteps, id) : undefined
        }));
    };

    const deleteStep = (id: string) => {
        setSteps(prev => deleteStepRecursive(prev, id));
    };

    // Recursive render helper
    const renderStep = (step: WorkoutStep) => {
        if (step.type === 'repeat' && step.subSteps) {
            return (
                <div key={step.id} className={styles.repeatBlock}>
                    <div className={styles.repeatHeader}>
                        <RefreshCcw size={14} className={styles.repeatIcon} />
                        <span className={styles.repeatTitle}>
                            {step.repeats}x {step.title ? `- ${step.title}` : ''}
                        </span>
                        <button onClick={() => deleteStep(step.id)} className={styles.deleteBtn} title="Remove Logic Block">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className={styles.subSteps}>
                        {step.subSteps.map((sub) => renderStep(sub))}
                    </div>
                </div>
            );
        }

        return (
            <div key={step.id} className={styles.stepCard}>
                <div className={styles.stepHeader}>
                    <div className={styles.stepTitle}>
                        <span className={styles.typeBadge}>{step.type}</span>
                        <span className={styles.titleText}>{step.title}</span>
                    </div>
                    {/* Only show delete if it's not the last step perhaps? Or always allow. */}
                    <button onClick={() => deleteStep(step.id)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className={styles.planDetails}>
                    <small>Planned: {step.duration || '-'} {step.pace ? `@ ${step.pace}` : ''}</small>
                </div>

                <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                        <label>Time</label>
                        <input
                            placeholder={step.duration || "10:00"}
                            value={step.actualDuration || ''}
                            onChange={(e) => updateStep(step.id, { actualDuration: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Pace/Dist</label>
                        <input
                            placeholder={step.pace || "5:00/km"}
                            value={step.actualPace || ''}
                            onChange={(e) => updateStep(step.id, { actualPace: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Avg HR</label>
                        <input
                            placeholder="145"
                            value={step.avgHr || ''}
                            onChange={(e) => updateStep(step.id, { avgHr: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={onCancel} className={styles.cancelBtn}>
                    <X size={24} />
                </button>
                <h2>Log Workout</h2>
                <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                    {saving ? 'Saving...' : <Save size={24} />}
                </button>
            </header>

            <div className={styles.scrollArea}>
                <p className={styles.instruction}>
                    Enter your actual stats. You can remove steps if you skipped them.
                </p>
                <div className={styles.stepsList}>
                    {steps.map((s) => renderStep(s))}
                </div>
            </div>
        </div>
    );
};
