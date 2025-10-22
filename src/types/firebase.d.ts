declare module '@/firebase' {
  export type FirebaseUser = {
    uid: string;
    displayName?: string | null;
    photoURL?: string | null;
    email?: string | null;
    isAnonymous?: boolean;
  } | null;

  export function useUser(): { user: FirebaseUser; loading: boolean };
}
