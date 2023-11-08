import { useEffect, useState } from "react";
import { AuthUser } from "@/auth/types";
import { onAuthentication } from "@/auth/api";

export function useAuthUser(): [ AuthUser | undefined, boolean ] {
    const [ user, setUser ] = useState<AuthUser>();
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        return onAuthentication(u => {
            setUser(u);
            setLoading(false);
        });
    }, []);

    return [ user, loading ];
}
