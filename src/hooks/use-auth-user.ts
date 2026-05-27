import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { isAdminUser, listenToAuthState } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    const unsubscribe = listenToAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    if (!unsubscribe) {
      setLoading(false);
    }

    return () => unsubscribe?.();
  }, []);

  return {
    user,
    loading,
    isAdmin: isAdminUser(user),
    isConfigured: isFirebaseConfigured,
  };
}
