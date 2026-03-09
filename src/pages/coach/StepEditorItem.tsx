import React from 'react';
import type { WorkoutStep } from '../../types';
import styles from './WorkoutEditorPage.module.css';
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';

interface StepEditorItemProps {
    step: WorkoutStep;
    index: number;
    stepsCount: number;
    onUpdate: (id: string, updates: Partial<WorkoutStep>) => void;
    onRemove: (id: string) => void;
    onMove: (index: number, direction: 'up' | 'down') => void;
    onAddSubStep: (parentId: string) => void;
}

export const StepEditorItem: React.FC<StepEditorItemProps> = ({
    step, index, stepsCount, onUpdate, onRemove, onMove, onAddSubStep
}) => {

    const handleTypeChange = (newType: string) => {
        const updates: Partial<WorkoutStep> = { type: newType as any };

        // Auto-update title if it matches a default type or is currently generic
        const currentTitleLower = step.title.toLowerCase();
        if (['run', 'rest', 'other', 'repeat', 'new step'].includes(currentTitleLower)) {
            updates.title = newType.charAt(0).toUpperCase() + newType.slice(1);
        }

        // Initialize subSteps if changing to repeat
        if (newType === 'repeat' && !step.subSteps) {
            updates.subSteps = [];
            updates.repeats = 2; // Default to 2 reps
        }

        onUpdate(step.id, updates);
    };

    const handleSubStepUpdate = (subStepId: string, updates: Partial<WorkoutStep>) => {
        if (!step.subSteps) return;
        const newSubSteps = step.subSteps.map(s => s.id === subStepId ? { ...s, ...updates } : s);
        onUpdate(step.id, { subSteps: newSubSteps });
    };

    const handleSubStepRemove = (subStepId: string) => {
        if (!step.subSteps) return;
        const newSubSteps = step.subSteps.filter(s => s.id !== subStepId);
        onUpdate(step.id, { subSteps: newSubSteps });
    };

    const handleSubStepMove = (subIndex: number, direction: 'up' | 'down') => {
        if (!step.subSteps) return;
        if (direction === 'up' && subIndex === 0) return;
        if (direction === 'down' && subIndex === step.subSteps.length - 1) return;

        const newSubSteps = [...step.subSteps];
        const targetIndex = direction === 'up' ? subIndex - 1 : subIndex + 1;
        [newSubSteps[subIndex], newSubSteps[targetIndex]] = [newSubSteps[targetIndex], newSubSteps[subIndex]];
        onUpdate(step.id, { subSteps: newSubSteps });
    };

    // We need a way to add a sub-step to THIS step specifically
    const addStepToThisGroup = () => {
        onAddSubStep(step.id);
    };

    if (step.type === 'repeat') {
        return (
            <div className={`${styles.stepItem} ${styles.repeatItem}`}>
                <div className={styles.stepControls}>
                    <button type="button" onClick={() => onMove(index, 'up')} disabled={index === 0}>
                        <ArrowUp size={14} />
                    </button>
                    <button type="button" onClick={() => onMove(index, 'down')} disabled={index === stepsCount - 1}>
                        <ArrowDown size={14} />
                    </button>
                </div>
                <div className={styles.repeatContent}>
                    <div className={styles.stepRow}>
                        <select
                            value={step.type}
                            onChange={e => handleTypeChange(e.target.value)}
                            className={styles.stepTypeSelect}
                        >
                            <option value="run">Run</option>
                            <option value="rest">Rest</option>
                            <option value="other">Other</option>
                            <option value="repeat">Repeat</option>
                        </select>
                        <input
                            type="number"
                            min="2"
                            value={step.repeats || 2}
                            onChange={e => onUpdate(step.id, { repeats: parseInt(e.target.value) || 1 })}
                            className={styles.repeatsInput}
                            placeholder="Reps"
                        />
                        <span className={styles.repeatLabel}>times</span>
                        <input
                            value={step.title}
                            onChange={e => onUpdate(step.id, { title: e.target.value })}
                            placeholder="Optional Label (e.g. Warmup)"
                            className={styles.stepTitleInput}
                        />
                    </div>

                    <div className={styles.subStepsContainer}>
                        {step.subSteps?.map((subStep, subIndex) => (
                            <StepEditorItem
                                key={subStep.id}
                                step={subStep}
                                index={subIndex}
                                stepsCount={step.subSteps?.length || 0}
                                onUpdate={handleSubStepUpdate}
                                onRemove={handleSubStepRemove}
                                onMove={handleSubStepMove}
                                onAddSubStep={(parentId) => {
                                    // Complex recursion: if a sub-step is ALSO a repeat, we need to handle deep adds.
                                    // For now, let's assuming simple 1-level nesting or implement deep update helper in parent
                                    // Actually, we can just handle it locally if we are the recursion point
                                    // Use local handler if parentId matches a child check?

                                    // Easier: The parent (Page) provides a 'updateStep' that updates the ROOT list. 
                                    // This component recursively updates ITS children, then calls onUpdate(me).
                                    // BUT `onAddSubStep` is for adding a NEW child. 

                                    // If we are passing `onAddSubStep` down, it implies the child is a Repeat block requesting a new item.
                                    // so:
                                    if (parentId === step.id) {
                                        // This shouldn't happen here, `addStepToThisGroup` handles direct adds. 
                                    } else {
                                        // It's a deeper nested add. We need to find the child and update it.
                                        // This implies we need to traverse. 
                                        // Let's simplified: Reuse logic.

                                        // Actually simplest way:
                                        // This component handles its own children.
                                        // If a child is a repeat, it will render a StepEditorItem for that child.
                                        // When that child wants to add a sub-step, it calls ITS props.onAddSubStep.
                                        // Which is `(id) => handleAddSubStepInternal(id)`.

                                        // So we need to handle adding a sub-step to one of OUR sub-steps.
                                        const targetSubStep = step.subSteps?.find(s => s.id === parentId);
                                        if (targetSubStep && targetSubStep.subSteps) {
                                            const newSub = {
                                                id: Math.random().toString(36).substr(2, 9),
                                                title: 'Run',
                                                type: 'run' as const,
                                                duration: '10 min'
                                            };
                                            const newSubSteps = [...(targetSubStep.subSteps || []), newSub];
                                            handleSubStepUpdate(parentId, { subSteps: newSubSteps });
                                        }
                                    }
                                }}
                            />
                        ))}
                        <button type="button" onClick={addStepToThisGroup} className={styles.addSubStepBtn}>
                            <Plus size={14} /> Add Step to Loop
                        </button>
                    </div>
                </div>
                <button type="button" onClick={() => onRemove(step.id)} className={styles.removeStepBtn}>
                    <Trash2 size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className={styles.stepItem}>
            <div className={styles.stepControls}>
                <button type="button" onClick={() => onMove(index, 'up')} disabled={index === 0}>
                    <ArrowUp size={14} />
                </button>
                <button type="button" onClick={() => onMove(index, 'down')} disabled={index === stepsCount - 1}>
                    <ArrowDown size={14} />
                </button>
            </div>
            <div className={styles.stepContent}>
                <div className={styles.stepRow}>
                    <input
                        value={step.title}
                        onChange={e => onUpdate(step.id, { title: e.target.value })}
                        placeholder="Step Title"
                        className={styles.stepTitleInput}
                    />
                    <select
                        value={step.type}
                        onChange={e => handleTypeChange(e.target.value)}
                        className={styles.stepTypeSelect}
                    >
                        <option value="run">Run</option>
                        <option value="rest">Rest</option>
                        <option value="other">Other</option>
                        <option value="repeat">Repeat</option>
                    </select>
                </div>
                <div className={styles.stepRow}>
                    <input
                        value={step.duration || ''}
                        onChange={e => onUpdate(step.id, { duration: e.target.value })}
                        placeholder="Duration (e.g. 10min)"
                    />
                    <input
                        value={step.pace || ''}
                        onChange={e => onUpdate(step.id, { pace: e.target.value })}
                        placeholder="Pace Hint"
                    />
                </div>
            </div>
            <button type="button" onClick={() => onRemove(step.id)} className={styles.removeStepBtn}>
                <Trash2 size={16} />
            </button>
        </div>
    );
};
