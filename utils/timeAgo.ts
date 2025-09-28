export function timeAgo(isoString: string) {
    const then = new Date(isoString);
    const now = new Date();

    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
        return `${diffDays}d`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months}m`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years}y`;
    }
}