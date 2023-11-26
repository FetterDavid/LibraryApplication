import { Button, Card, CardBody, CardFooter, Input, Spinner } from "@material-tailwind/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { login } from "@/auth/api";
import { displayErrorNotification } from "@/notifications";
import { useAuthUser } from "@/auth/hooks";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
    const [ user, loadingUser ] = useAuthUser();

    return (
        <LoadingView condition={ loadingUser }>
            <LoadingViewError condition={ !!user }>
                <Navigate to="/" />
            </LoadingViewError>
            <LoadingViewContent>
                <LoginPageContent />
            </LoadingViewContent>
        </LoadingView>
    );
}

function LoginPageContent() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const [ error, setError ] = useState(false);

    const canLogin = useMemo(() => {
        return !!username && !!password;
    }, [ password, username ]);

    const attemptLogin = useCallback(() => {
        if (!canLogin) return;

        setLoading(true);
        login(username, password)
            .catch(reason => {
                console.error(reason);
                displayErrorNotification("Hibás felhasználónév vagy jelszó!");
                setError(true);
            })
            .finally(() => setLoading(false));
    }, [ canLogin, username, password ]);

    useEffect(() => {
        setError(false);
    }, [ username, password ]);

    return (
        <div className="w-screen h-screen grid place-content-center">
            <Card className="w-80">
                <CardBody className="flex flex-col items-stretch gap-2">
                    <Input crossOrigin="" value={ username } onChange={ event => {
                        setUsername(event.currentTarget.value);
                    } } label="Felhasználónév" type="text" error={ error } />
                    <Input crossOrigin="" value={ password } onChange={ event => {
                        setPassword(event.currentTarget.value);
                    } } label="Jelszó" type="password" error={ error } />
                </CardBody>
                <CardFooter>
                    <Button disabled={ !canLogin || loading } onClick={ attemptLogin }
                            fullWidth className="grid place-content-center">
                        { loading ? <Spinner className="w-4 h-4" /> : "Bejelentkezés" }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
