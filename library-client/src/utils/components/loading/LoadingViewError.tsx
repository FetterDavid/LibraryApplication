import { Fragment, useContext, useEffect } from "react";
import { LoadingViewContext } from "@/utils/components/loading/LoadingView";
import { ComponentChildrenProps } from "@/utils/types";

interface LoadingViewErrorProps extends ComponentChildrenProps {
    condition: boolean;
}

export default function LoadingViewError(props: LoadingViewErrorProps) {
    const context = useContext(LoadingViewContext);

    useEffect(() => {
        context.setErrorCondition(props.condition);
    }, [ props, context ]);

    return context.loading || !props.condition ? null : (
        <Fragment>
            { props.children }
        </Fragment>
    );
}
