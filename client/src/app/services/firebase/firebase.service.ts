import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    constructor(private auth: Auth) {}

    async signIn(email: string, password: string): Promise<void> {
        if (!this.auth) {
            console.error('Firebase Auth is not initialized');
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            console.log('User signed in:', userCredential.user);
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw error;
        }
    }

    async createUser(email: string, password: string): Promise<void> {
        if (!this.auth) {
            console.error('Firebase Auth is not initialized');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            console.log('User created:', userCredential.user);
        } catch (error) {
            console.error('Error during account creation:', error);
            throw error;
        }
    }

    async getToken(): Promise<string | null> {
        const user = this.auth.currentUser;
        if (user) {
            return await user.getIdToken();
        }
        return null;
    }
}
