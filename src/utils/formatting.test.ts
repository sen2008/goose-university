import { describe, it, expect } from 'vitest';
import { formatNumber, formatTime } from './formatting';

describe('Formatting Utils', () => {
    it('should format small numbers', () => {
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(100)).toBe('100');
        expect(formatNumber(999)).toBe('999');
    });

    it('should format thousands', () => {
        expect(formatNumber(1000)).toBe('1.0k');
        expect(formatNumber(1500)).toBe('1.5k');
        expect(formatNumber(999900)).toBe('999.9k');
    });

    it('should format millions', () => {
        expect(formatNumber(1000000)).toBe('1.00M');
        expect(formatNumber(1500000)).toBe('1.50M');
    });

    it('should format time', () => {
        expect(formatTime(0)).toBe('00:00:00');
        expect(formatTime(65)).toBe('00:01:05'); // 1m 5s
        expect(formatTime(3665)).toBe('01:01:05'); // 1h 1m 5s
    });
});
