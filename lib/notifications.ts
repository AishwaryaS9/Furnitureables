import { formatOrderDate } from "./order";

export function formatNotificationTime(iso: string) {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return "-";
    return `${formatOrderDate(iso)} · ${parsed.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
}
