import { atom, useRecoilState } from "recoil";

export interface AuthState {
  token: string | null;
  pubKey: string | null;
}

const authState = atom<AuthState>({
  key: "authState",
  default: { token: null, pubKey: null },
});

export function useAuthStore() {
  const [auth, setRecoilAuth] = useRecoilState(authState);

  const clearAuth = () => {
    if (auth.token !== null || auth.pubKey !== null) {
      setRecoilAuth({ token: null, pubKey: null });
      localStorage.removeItem("auth");
    }
  };

  return {
    ...auth,
    setAuth: (newAuth: AuthState) => {
      // Only set if different
      if (auth.token !== newAuth.token || auth.pubKey !== newAuth.pubKey) {
        setRecoilAuth(newAuth);
        localStorage.setItem("auth", JSON.stringify(newAuth));
      }
    },
    clearAuth,
  };
}