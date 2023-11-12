import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { IconButton, IconButtonProps } from "@material-tailwind/react";

export type DestructiveIconButtonProps = Omit<Omit<IconButtonProps, "color">, "variant">

export default function DestructiveIconButton(props: DestructiveIconButtonProps) {
    const [ isConfirming, setIsConfirming ] = useState(false);

    useEffect(() => {
        if (!isConfirming) return;

        const id = setTimeout(() => setIsConfirming(false), 4000);
        return () => clearTimeout(id);
    }, [ isConfirming ]);

    const fireEvent = useCallback<MouseEventHandler<HTMLButtonElement>>(event => {
        setIsConfirming(prevState => {
            if (prevState && !!props.onClick) props.onClick(event);
            return !prevState;
        });
    }, [ props ]);

    return (
        <IconButton color="red" variant={ isConfirming ? "gradient" : "text" }
                    onClick={ fireEvent }>
            { props.children }
        </IconButton>
    );
}
