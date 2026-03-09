import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { WorkoutService } from '../../services/workoutService';
import type { Workout, WorkoutStep, WorkoutType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import styles from './WorkoutEditorPage.module.css';
import { Plus } from 'lucide-react';
import { StepEditorItem } from './StepEditorItem';

// Simple ID generator if uuid not available
const generateId = () => Math.random().toString(36).substr(2, 9);

export const WorkoutEditorPage: React.FC = () => {
    const { athleteId, workoutId } = useParams<{ athleteId: string; workoutId?: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { userRole, user } = useAuth(); // Ensure security

    const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Form State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(initialDate);
    const [type, setType] = useState<WorkoutType>('Easy');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState<WorkoutStep[]>([]);
    const [loading, setLoading] = useState(!!workoutId);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!workoutId) return;
        const loadWorkout = async () => {
            try {
                const w = await WorkoutService.getWorkoutById(workoutId);
                if (w) {
                    setTitle(w.title);
                    setDate(w.date);
                    setType(w.type);
                    setDescription(w.description || '');
                    setSteps(w.steps || []);
                }
            } catch (error) {
                console.error("Failed to load workout", error);
            } finally {
                setLoading(false);
            }
        };
        loadWorkout();
    }, [workoutId]);

    // Auto-populate default steps for Intervals
    useEffect(() => {
        if (type === 'Intervals') {
            // Check if we should populate (e.g. if it has only default 1 step or is empty)
            const isDefaultState = steps.length === 0 || (steps.length === 1 && steps[0].title === 'Run' && !steps[0].duration && !steps[0].pace);

            if (isDefaultState) {
                setSteps([
                    {
                        id: generateId(),
                        title: 'Warm Up',
                        type: 'run',
                        duration: '10 min',
                        pace: 'Easy'
                    },
                    {
                        id: generateId(),
                        title: 'Main Set',
                        type: 'repeat',
                        repeats: 4,
                        subSteps: [
                            { id: generateId(), title: 'Fast', type: 'run', duration: '400m', pace: 'Fast' },
                            { id: generateId(), title: 'Rest', type: 'rest', duration: '2 min', pace: 'Walk' }
                        ]
                    },
                    {
                        id: generateId(),
                        title: 'Cool Down',
                        type: 'run',
                        duration: '10 min',
                        pace: 'Easy'
                    }
                ]);
            }
        }
    }, [type]); // Only run when type changes

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!athleteId || !userRole || !user) return;

        setSaving(true);
        try {
            const workoutData: Partial<Workout> = {
                title,
                date,
                type,
                description,
                steps,
                athleteId,
                coachId: user.uid,
            };
            // Note: We need auth.uid for coachId. `useAuth` user object has it.
            // Let's assume the repository handles permission checks or we just pass it.
            // Since we are adding `athleteId` to the workout manually here.

            if (workoutId) {
                await WorkoutService.updateWorkout(workoutId, workoutData);
            } else {
                await WorkoutService.createWorkout({
                    ...workoutData,
                    athleteId
                } as any); // Cast because createWorkout expects Omit<Workout, 'id'> and some fields might be missing in Partial
            }
            navigate(`/coach/athlete/${athleteId}`);
        } catch (error) {
            console.error("Failed to saving workout", error);
            alert("Failed to save workout");
        } finally {
            setSaving(false);
        }
    };

    const addStep = () => {
        setSteps([...steps, {
            id: generateId(),
            title: 'Run',
            type: 'run',
            duration: '10 min'
        }]);
    };

    const updateStep = (id: string, fieldOrUpdates: keyof WorkoutStep | Partial<WorkoutStep>, value?: any) => {
        setSteps(steps.map(s => {
            if (s.id !== id) return s;

            if (typeof fieldOrUpdates === 'object') {
                return { ...s, ...fieldOrUpdates };
            }
            return { ...s, [fieldOrUpdates]: value };
        }));
    };

    const removeStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id));
    };

    const moveStep = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === steps.length - 1) return;

        const newSteps = [...steps];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
        setSteps(newSteps);
    };

    if (loading) return <div>Loading editor...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button type="button" onClick={() => navigate(-1)} className={styles.cancelButton}>Cancel</button>
                <h1 className={styles.pageTitle}>{workoutId ? 'Edit Workout' : 'New Workout'}</h1>
                <button onClick={handleSave} disabled={saving} className={styles.saveButton}>
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </header>

            <form className={styles.form}>
                <div className={styles.field}>
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Long Run"
                        required
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Type</label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value as WorkoutType)}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Intervals">Intervals</option>
                            <option value="Long">Long Run</option>
                            <option value="Strength">Strength</option>
                        </select>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Workout details..."
                        rows={3}
                    />
                </div>

                <div className={styles.stepsConfig}>
                    <div className={styles.stepsHeader}>
                        <h3>Steps</h3>
                        <button type="button" onClick={addStep} className={styles.addStepBtn}>
                            <Plus size={16} /> Add Step
                        </button>
                    </div>

                    <div className={styles.stepList}>
                        {steps.map((step, index) => (
                            <StepEditorItem
                                key={step.id}
                                step={step}
                                index={index}
                                stepsCount={steps.length}
                                onUpdate={updateStep}
                                onRemove={removeStep}
                                onMove={moveStep}
                                onAddSubStep={(parentId) => {
                                    // This handler is called when a top-level Repeat block wants to add a direct child
                                    const targetStep = steps.find(s => s.id === parentId);
                                    if (targetStep && targetStep.subSteps) {
                                        const newSub = {
                                            id: generateId(),
                                            title: 'Run',
                                            type: 'run' as const,
                                            duration: '10 min'
                                        };
                                        const newSubSteps = [...targetStep.subSteps, newSub];
                                        updateStep(parentId, 'subSteps', newSubSteps);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
};
