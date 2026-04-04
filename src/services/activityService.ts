import type { Activity } from '../types';
import { FirestoreActivityRepository } from './firestoreActivityRepository';

const repository = FirestoreActivityRepository;

export const ActivityService = {
    getActivitiesForAthlete: async (athleteId: string): Promise<Activity[]> => {
        return repository.getActivitiesForAthlete(athleteId);
    },

    createActivity: async (activity: Omit<Activity, 'id'>): Promise<string> => {
        return repository.createActivity(activity);
    },

    deleteActivity: async (id: string): Promise<void> => {
        return repository.deleteActivity(id);
    }
};
