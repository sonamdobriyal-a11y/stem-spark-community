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

const signInErrorMessages: Record<string, string> = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

const signUpErrorMessages: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/operation-not-allowed": "Account creation is not available right now.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

function getFirebaseAuthErrorCode(error: unknown): string | undefined {
  if (error != null && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}

export function getAuthErrorMessage(error: unknown, mode: "signin" | "signup"): string {
  const code = getFirebaseAuthErrorCode(error);
  const messages = mode === "signin" ? signInErrorMessages : signUpErrorMessages;

  if (code && messages[code]) {
    return messages[code];
  }

  if (error instanceof Error && error.message === "Firebase Auth is not configured.") {
    return "Sign-in is unavailable right now.";
  }

  return mode === "signin"
    ? "Could not sign in. Please check your email and password."
    : "Could not create your account. Please try again.";
}

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
