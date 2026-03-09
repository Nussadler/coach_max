import type { UserRepository } from '../types/repository';
import type { UserProfile } from '../types';
import { db } from '../app/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export const FirestoreUserRepository: UserRepository = {
    getAthletes: async (coachId: string): Promise<UserProfile[]> => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(
                usersRef,
                where('role', '==', 'athlete'),
                where('coachId', '==', coachId)
            );

            const querySnapshot = await getDocs(q);
            const athletes: UserProfile[] = [];

            querySnapshot.forEach((doc) => {
                // We store the uid in the document ID usually, but also helpful to have it in the object
                athletes.push({ uid: doc.id, ...doc.data() } as UserProfile);
            });

            return athletes;
        } catch (error) {
            console.error("Error fetching athletes:", error);
            return [];
        }
    },

    getUserProfile: async (uid: string): Promise<UserProfile | undefined> => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
            }
            return undefined;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return undefined;
        }
    }
};
