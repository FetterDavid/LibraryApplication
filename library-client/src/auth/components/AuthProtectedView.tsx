import { useAuthUser } from "@/auth/hooks";
import { Navigate } from "react-router-dom";
import { LoadingView, LoadingViewContent, LoadingViewError } from "@/utils/components/loading";
import { ComponentChildrenProps } from "@/utils/types";

export default function AuthProtectedView(props: ComponentChildrenProps) {
    const [ user, loadingUser ] = useAuthUser();

    return (
        <LoadingView condition={ loadingUser }>
            <LoadingViewError condition={ !user }>
                <Navigate to="/login" replace />
            </LoadingViewError>
            <LoadingViewContent children={ props.children } />
        </LoadingView>
    );
}
