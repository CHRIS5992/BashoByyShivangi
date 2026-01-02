import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sign up with email and password
    const signup = async (email, password, displayName) => {
        try {
            setError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            if (displayName) {
                await updateProfile(userCredential.user, { displayName });
            }

            return userCredential;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Login with email and password
    const login = async (email, password) => {
        try {
            setError(null);
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Login with Google
    const loginWithGoogle = async () => {
        try {
            setError(null);
            const provider = new GoogleAuthProvider();
            return await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Logout
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Update user profile
    const updateUserProfile = async (updates) => {
        try {
            setError(null);
            if (currentUser) {
                await updateProfile(currentUser, updates);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        // Skip if auth is not initialized (Firebase not configured)
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
        error,
        loading,
        isConfigured: isFirebaseConfigured
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
