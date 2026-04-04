import type { Activity } from '../types';
import { db } from '../app/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const FirestoreActivityRepository = {
    getActivitiesForAthlete: async (athleteId: string): Promise<Activity[]> => {
        try {
            const activitiesRef = collection(db, 'activities');

            // Note: We might need a composite index for athleteId + date (DESC).
            // For now, we fetch by athleteId and sort client-side, or try orderBy if indexed.
            const q = query(
                activitiesRef,
                where('athleteId', '==', athleteId)
            );

            const querySnapshot = await getDocs(q);
            const activities: Activity[] = [];

            querySnapshot.forEach((doc) => {
                activities.push({ id: doc.id, ...doc.data() } as Activity);
            });

            // Sort newest first client-side (fallback in case composite index is missing)
            activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            return activities;
        } catch (error) {
            console.error("Error fetching activities:", error);
            return [];
        }
    },

    createActivity: async (activity: Omit<Activity, 'id'>): Promise<string> => {
        const { addDoc, collection } = await import('firebase/firestore');
        const { db } = await import('../app/firebase');

        try {
            const docRef = await addDoc(collection(db, 'activities'), activity);
            return docRef.id;
        } catch (error) {
            console.error("Error creating activity:", error);
            throw error;
        }
    },

    deleteActivity: async (id: string): Promise<void> => {
        const { deleteDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../app/firebase');

        try {
            await deleteDoc(doc(db, 'activities', id));
        } catch (error) {
            console.error("Error deleting activity:", error);
            throw error;
        }
    }
};
