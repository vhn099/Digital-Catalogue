'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, onIdTokenChanged, User } from 'firebase/auth';
import nookies from 'nookies';
import firebase_app from '@/firebase/config';
import { useRouter } from 'next/navigation';

// Initialize Firebase auth instance

export const AuthFirebaseContext = createContext({
    setUser: (user: any) => {},
    setLoading: (loading: any) => {},
    user: null,
    loading: null,
    auth: null,
});

export const useAuthFirebaseContext = () => useContext(AuthFirebaseContext);

interface ProviderProps {
    children: ReactNode
}

export function AuthFirebaseProvider ({ children }: ProviderProps): JSX.Element {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(getAuth(firebase_app));
    const [loading, setLoading] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkUserLoggedIn = () => {
            // if (!auth) {
            //     setAuth(getAuth(firebase_app));
            // }
            if (!auth) {
                setAuth(getAuth(firebase_app));
            }
            onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                    const token = await currentUser.getIdToken();
                    nookies.set(undefined, 'firebase-token', token, { path: '/' });
                } else {
                    nookies.set(undefined, 'firebase-token', '', { path: '/' });
                    router.push("/login");
                    setUser(null);
                }
                setLoading(false);
            });
        }
        return () => checkUserLoggedIn();
    }, [auth, router]);

    return (
        <AuthFirebaseContext.Provider value={{ user, auth, loading, setUser, setLoading }}>
            {children}
        </AuthFirebaseContext.Provider>
    )
}