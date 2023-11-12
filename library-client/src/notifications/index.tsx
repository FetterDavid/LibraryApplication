import { createRoot } from "react-dom/client";
import { Notification } from "@/notifications/components";

const container = document.getElementById("notifications-container") as HTMLDivElement;

export function displayInfoNotification(text: string) {
    displayNotification(text, false);
}

export function displayErrorNotification(text: string) {
    displayNotification(text, true);
}

function displayNotification(text: string, error: boolean) {
    const rootContainer = document.createElement("div");
    rootContainer.id = `${ Math.round(Math.random() * 0xfff) }:${ (Date.now()).toString(16) }`;
    container.appendChild(rootContainer);

    const root = createRoot(rootContainer);
    root.render(
        <Notification text={ text } error={ error } onDismiss={ () => {
            root.unmount();
            rootContainer.remove();
        } } />
    );
}
