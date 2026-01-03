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
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

// Helper function to save/update user in Django backend
const saveUserToDjango = async (firebaseUser) => {
    try {
        console.log('🔄 Attempting to save user to Django...', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
        });

        const userData = {
            username: firebaseUser.uid, // Use Firebase UID as username
            email: firebaseUser.email,
            first_name: firebaseUser.displayName ? firebaseUser.displayName.split(' ')[0] : '',
            last_name: firebaseUser.displayName ? firebaseUser.displayName.split(' ').slice(1).join(' ') : ''
        };

        console.log('📤 Sending user data to /api/create-user/:', userData);

        const response = await axios.post('/api/create-user/', userData);
        
        console.log('✅ User saved to Django database:', response.data);
    } catch (error) {
        // Log detailed error information
        console.error('❌ Error saving user to Django:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            fullError: error
        });
    }
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

            // Save user to Django backend
            await saveUserToDjango(userCredential.user);

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Sync user to Django database
            await saveUserToDjango(userCredential.user);
            
            return userCredential;
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
            const result = await signInWithPopup(auth, provider);
            
            // Save Google user to Django database
            await saveUserToDjango(result.user);
            
            return result;
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
