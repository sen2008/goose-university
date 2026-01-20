export function formatNumber(value: number): string {
    if (value < 1000) {
        return Math.floor(value).toString();
    }
    if (value < 1000000) {
        return (value / 1000).toFixed(1) + 'k';
    }
    if (value < 1000000000) {
        return (value / 1000000).toFixed(2) + 'M';
    }
    return value.toExponential(2);
}

export function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
