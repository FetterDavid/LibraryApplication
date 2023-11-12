import { useCallback, useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { MaterialSymbol } from "@/utils/components";

const NOTIFICATION_TIMEOUT_DELAY_MS = 4000;

interface NotificationProps {
    text: string;
    error: boolean;

    onDismiss(): void;
}

export default function Notification(props: NotificationProps) {
    const [ , setTimeoutId ] = useState<NodeJS.Timeout>();
    const [ startedAt, setStartedAt ] = useState<number>();
    const [ progress, setProgress ] = useState<number>();

    const startTimeout = useCallback(() => {
        setTimeoutId(setTimeout(props.onDismiss, NOTIFICATION_TIMEOUT_DELAY_MS));
        setStartedAt(Date.now());
    }, [ props.onDismiss ]);

    const stopTimeout = useCallback(() => {
        setTimeoutId(prevState => {
            clearTimeout(prevState);
            return undefined;
        });
        setStartedAt(undefined);
    }, []);

    useEffect(() => {
        startTimeout();
        return stopTimeout;
    }, [ startTimeout, stopTimeout ]);

    useEffect(() => {
        let handler: number;
        const animate = () => {
            if (!!startedAt) {
                setProgress(
                    (1 - (Date.now() - startedAt) / NOTIFICATION_TIMEOUT_DELAY_MS) * 100
                );
                handler = requestAnimationFrame(animate);
            } else {
                setProgress(100);
                cancelAnimationFrame(handler);
            }
        };
        handler = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(handler);
    }, [ startedAt ]);

    return (
        <Card className="animate-notification-sweep-in overflow-hidden max-w-sm
        hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 transition-all"
              onMouseEnter={ stopTimeout }
              onMouseLeave={ startTimeout }>
            <CardBody className="flex flex-row items-start justify-start gap-6">
                <MaterialSymbol name={ props.error ? "warning" : "info" }
                                className={ props.error ? "text-red-200" : "text-blue-200" } />
                <Typography className="font-bold row-span-full overflow-scroll max-h-96"
                            variant="small">
                    { String(props.text) }
                </Typography>
            </CardBody>
            <CardFooter className="p-0">
                <div className={ `h-1 ${ props.error ? "bg-red-200" : "bg-blue-200" }` }
                     style={ {
                         width: `${ progress }%`
                     } }></div>
            </CardFooter>
        </Card>
    );
}
