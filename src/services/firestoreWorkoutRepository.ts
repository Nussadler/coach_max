import type { WorkoutRepository } from '../types/repository';
import type { Workout } from '../types';
import { db, auth } from '../app/firebase';
import { collection, query, where, getDocs, doc, getDoc, type QueryConstraint } from 'firebase/firestore';

export const FirestoreWorkoutRepository: WorkoutRepository = {
    getWorkoutsForWeek: async (athleteId: string, startDate: string, endDate: string): Promise<Workout[]> => {
        try {
            const workoutsRef = collection(db, 'workouts');
            const constraints: QueryConstraint[] = [
                where('athleteId', '==', athleteId),
                where('date', '>=', startDate),
                where('date', '<=', endDate)
            ];

            // If current user is not the athlete, filter by coachId to satisfy security rules
            if (auth.currentUser && auth.currentUser.uid !== athleteId) {
                constraints.push(where('coachId', '==', auth.currentUser.uid));
            }

            const q = query(workoutsRef, ...constraints);

            const querySnapshot = await getDocs(q);
            const workouts: Workout[] = [];

            querySnapshot.forEach((doc) => {
                workouts.push({ id: doc.id, ...doc.data() } as Workout);
            });

            return workouts;
        } catch (error) {
            console.error("Error fetching workouts:", error);
            return [];
        }
    },

    getWorkoutById: async (id: string): Promise<Workout | undefined> => {
        try {
            const docRef = doc(db, 'workouts', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Workout;
            } else {
                return undefined;
            }
        } catch (error) {
            console.error("Error fetching workout by ID:", error);
            return undefined;
        }
    },

    createWorkout: async (workout: Omit<Workout, 'id'>): Promise<string> => {
        const { addDoc, collection } = await import('firebase/firestore');
        const { db } = await import('../app/firebase');

        try {
            const docRef = await addDoc(collection(db, 'workouts'), workout);
            return docRef.id;
        } catch (error) {
            console.error("Error creating workout:", error);
            throw error;
        }
    },

    updateWorkout: async (id: string, workout: Partial<Workout>): Promise<void> => {
        const { updateDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../app/firebase');

        try {
            const docRef = doc(db, 'workouts', id);
            await updateDoc(docRef, workout);
        } catch (error) {
            console.error("Error updating workout:", error);
            throw error;
        }
    },

    deleteWorkout: async (id: string): Promise<void> => {
        const { deleteDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../app/firebase');

        try {
            await deleteDoc(doc(db, 'workouts', id));
        } catch (error) {
            console.error("Error deleting workout:", error);
            throw error;
        }
    }
};
