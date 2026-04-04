import type { UserProfile } from '../types';
import { FirestoreUserRepository } from './firestoreUserRepository';

const repository = FirestoreUserRepository;

export const UserService = {
    getAthletes: async (coachId: string): Promise<UserProfile[]> => {
        return repository.getAthletes(coachId);
    },

    getUserProfile: async (uid: string): Promise<UserProfile | undefined> => {
        return repository.getUserProfile(uid);
    },

    updateUserProfile: async (uid: string, data: Partial<UserProfile>): Promise<void> => {
        return repository.updateUserProfile(uid, data);
    }
};
