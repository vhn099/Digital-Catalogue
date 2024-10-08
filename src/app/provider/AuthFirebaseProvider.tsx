'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import firebase_app from '@/firebase/config';
import { useRouter } from 'next/navigation';

// Initialize Firebase auth instance
const auth = getAuth(firebase_app);

export const AuthFirebaseContext = createContext({
    setUser: (user: any) => {},
    user: null,
    setLoading: (loading: any) => {},
});

export const useAuthFirebaseContext = () => useContext(AuthFirebaseContext);

interface ProviderProps {
    children: ReactNode
}

export function AuthFirebaseProvider ({ children }: ProviderProps): JSX.Element {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkUserLoggedIn = () => {
            onAuthStateChanged(auth, (currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                } else {
                    router.push("/login");
                    setUser(null);
                }
                setLoading(false);
            });
        }
        return () => checkUserLoggedIn();
    }, [router]);

    return (
        <AuthFirebaseContext.Provider value={{ user, setUser, setLoading }}>
            { loading ? <div>Loading...</div> : children }
        </AuthFirebaseContext.Provider>
    )
}