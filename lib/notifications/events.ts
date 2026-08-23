import { AdminNotificationEvent } from "@/types/notification";
import { EventEmitter } from "events";

const EVENT_NAME = "admin-notification";

declare global {
    var __adminNotificationEmitter: EventEmitter | undefined;
}

function getEmitter() {
    if (!global.__adminNotificationEmitter) {
        const emitter = new EventEmitter();
        emitter.setMaxListeners(50);
        global.__adminNotificationEmitter = emitter;
    }
    return global.__adminNotificationEmitter;
}

export function publishAdminNotification(event: AdminNotificationEvent) {
    getEmitter().emit(EVENT_NAME, event);
}

export function subscribeToAdminNotifications(
    listener: (event: AdminNotificationEvent) => void
) {
    const emitter = getEmitter();
    emitter.on(EVENT_NAME, listener);

    return () => {
        emitter.off(EVENT_NAME, listener);
    };
}