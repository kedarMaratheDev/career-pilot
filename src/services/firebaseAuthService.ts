import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { db } from "../config/firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthUser>;
  signup(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}

const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  return {
    id: user.uid,
    email: user.email || "",
  };
};

export const firebaseAuthService: AuthService = {
  async login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = mapFirebaseUser(result.user);
      if (!user) {
        throw new Error("Failed to map user data");
      }
      return user;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      throw new Error(message);
    }
  },

  async signup(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = mapFirebaseUser(result.user);
      if (!user) {
        throw new Error("Failed to map user data");
      }

      // Create user profile document in Firestore
      await setDoc(doc(db, "users", user.id), {
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return user;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";
      throw new Error(message);
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Logout failed. Please try again.";
      throw new Error(message);
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(mapFirebaseUser(user));
      });
    });
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      callback(mapFirebaseUser(user));
    });
    return unsubscribe;
  },
};
