import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../app/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userRole: 'athlete' | 'coach' | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    userRole: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<'athlete' | 'coach' | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Check/Create user document
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    // Create new user document
                    await setDoc(userRef, {
                        email: currentUser.email,
                        role: 'athlete',
                        displayName: '',
                        coachId: ''
                    });
                    setUserRole('athlete');
                } else {
                    setUserRole(userSnap.data().role as 'athlete' | 'coach');
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, userRole }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
