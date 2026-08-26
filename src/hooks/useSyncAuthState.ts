import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useAuthStore } from "../stores/StoreAuth";

export function useSyncAuthState() {
  const auth = useAuth();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    setAuth(auth.user?.access_token ?? null, auth.isAuthenticated);
  }, [auth.user, auth.isAuthenticated, setAuth]);
}