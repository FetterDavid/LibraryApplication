import { AuthUser } from "@/auth/types";
import { Unsubscribe } from "@/utils/types";
import { apiRequest } from "@/utils/api";

const LS_KEY_AUTH_USER_DATA = "LibraryApplication::Auth::UserData";

interface AuthStateListener {
    (user: AuthUser | undefined): void;
}

const authListeners: AuthStateListener[] = [];

export function onAuthentication(listener: AuthStateListener): Unsubscribe {
    authListeners.push(listener);
    listener(structuredClone(getAuthUserData()));
    return () => offAuthentication(listener);
}

function offAuthentication(listener: AuthStateListener) {
    delete authListeners[authListeners.indexOf(listener)];
}

function getAuthUserData(): AuthUser | undefined {
    const data = window.localStorage.getItem(LS_KEY_AUTH_USER_DATA);
    return !!data ? JSON.parse(data) : undefined;
}

function refreshAuthState(data: AuthUser | undefined) {
    if (!!data) {
        window.localStorage.setItem(LS_KEY_AUTH_USER_DATA, JSON.stringify(data));
    } else {
        window.localStorage.removeItem(LS_KEY_AUTH_USER_DATA);
    }

    authListeners.forEach(listener => listener(data));
}

export async function login(username: string, password: string) {
    const params = new URLSearchParams({
        UserName: username,
        Password: password
    });

    const userData = await apiRequest<AuthUser>(`/Librarian/login?${ params }`, "GET");
    refreshAuthState(userData);
}

export function logout() {
    refreshAuthState(undefined);
}
