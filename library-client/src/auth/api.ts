import { AuthUser } from "@/auth/types";
import { Unsubscribe } from "@/utils/types";
import { apiRequest } from "@/utils/api";

const LS_KEY_AUTH_USER_DATA = "LibraryApplication::Auth::UserData";

interface AuthStateListener {
    (user: AuthUser | undefined): void;
}

const authListeners: AuthStateListener[] = [];

let authUserData: AuthUser | undefined = undefined
;(() => {
    const lsData = window.localStorage.getItem(LS_KEY_AUTH_USER_DATA);
    refreshAuthState(!!lsData ? JSON.parse(lsData) : undefined);
})();

export function onAuthentication(listener: AuthStateListener): Unsubscribe {
    authListeners.push(listener);
    listener(structuredClone(authUserData));
    return () => offAuthentication(listener);
}

function offAuthentication(listener: AuthStateListener) {
    delete authListeners[authListeners.indexOf(listener)];
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
    const userData = await apiRequest<AuthUser>("/Librarian/login", "GET", {
        UserName: username,
        Password: password
    });

    refreshAuthState(userData);
}

export function logout() {
    refreshAuthState(undefined);
}
