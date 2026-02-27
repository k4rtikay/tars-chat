/**
 * Format a timestamp for display in the chat.
 *
 * - Today: "2:34 PM"
 * - This year: "Feb 15, 2:34 PM"
 * - Older: "Feb 15, 2025, 2:34 PM"
 */
export function formatMessageTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const isSameYear = date.getFullYear() === now.getFullYear();

    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    if (isToday) {
        return time;
    }

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();

    if (isSameYear) {
        return `${month} ${day}, ${time}`;
    }

    return `${month} ${day}, ${date.getFullYear()}, ${time}`;
}
