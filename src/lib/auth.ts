import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, type DocumentData } from "firebase/firestore";
import { auth, firestore, isFirebaseConfigured } from "@/lib/firebase";

const adminEmails = String(import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function listenToAuthState(onUser: (user: User | null) => void): Unsubscribe | null {
  if (!auth) return null;
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      saveUserProfile(user).catch((error) => {
        console.error("Failed to sync user profile", error);
      });
    }

    onUser(user);
  });
}

export function isAdminUser(user: User | null) {
  return !!user?.email && adminEmails.includes(user.email.toLowerCase());
}

export function hasAdminAllowlist() {
  return adminEmails.length > 0;
}

export async function signInWithEmail(email: string, password: string) {
  if (!auth) throw new Error("Firebase Auth is not configured.");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await saveUserProfile(credential.user);
  return credential.user;
}

export async function createAccountWithEmail(name: string, email: string, password: string) {
  if (!auth) throw new Error("Firebase Auth is not configured.");
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }

  await saveUserProfile(credential.user, name.trim());
  return credential.user;
}

export function signOutUser() {
  if (!auth) return Promise.resolve();
  return signOut(auth);
}

export function getDisplayName(user: User) {
  return user.displayName || user.email?.split("@")[0] || "Community Member";
}

export function getInitials(nameOrEmail: string) {
  const parts = nameOrEmail
    .replace(/@.*/, "")
    .split(/\s|\.|_/)
    .filter(Boolean);

  return (parts[0]?.[0] ?? "U").concat(parts[1]?.[0] ?? "").toUpperCase();
}

async function saveUserProfile(user: User, fallbackName?: string) {
  if (!isFirebaseConfigured || !firestore) return;

  const displayName = user.displayName || fallbackName || user.email?.split("@")[0] || "User";
  const userRef = doc(firestore, "users", user.uid);
  const existingUser = await getDoc(userRef);
  const payload: DocumentData = {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL: user.photoURL,
    updatedAt: serverTimestamp(),
  };

  if (!existingUser.exists()) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(userRef, payload, { merge: true });
}
