import moment from 'moment';
import { getLastOnlineLabel } from '../adverts';
import { toMoment } from '../time';

let mockValue: moment.Moment = moment();
const mockFn = jest.fn((text, args) => {
    return text.replace(/{{(.*?)}}/g, (_: string, match: string) => args[match.trim()]);
});

jest.mock('../time', () => ({
    ...jest.requireActual('../time'),
    toMoment: jest.fn(() => mockValue),
}));

describe('getLastOnlineLabel', () => {
    const lastOnlineTime = 1685446791;
    const isOnline = false;
    it('should return "Online" when lastOnlineTime is not passed and user is online', () => {
        expect(getLastOnlineLabel(true, mockFn)).toBe('Online');
    });
    it('should return "Seen n hours ago" when last seen is in hours', () => {
        mockValue = moment('2023-05-30T18:48:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 3 hours ago');
    });
    it('should return "Seen 1 hour ago" when user was last seen 1 hour ago', () => {
        mockValue = moment('2023-05-30T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 1 hour ago');
    });
    it('should return  "Seen more than 6 months ago" when user was last online more than 6 months ago', () => {
        mockValue = moment('2024-01-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen more than 6 months ago');
    });
    it('should return "Seen 1 month ago" when user was last online 1 month ago', () => {
        mockValue = moment('2023-07-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 1 month ago');
    });
    it('should return "Seen 1 minute ago" when user was last online 1 minute ago', () => {
        mockValue = moment('2023-05-30T15:41:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 1 minute ago');
    });
    it('should return "Seen n minutes ago" when last seen is in minutes', () => {
        mockValue = moment('2023-05-30T15:42:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 2 minutes ago');
    });
    it('should return "Online" when last seen is in seconds', () => {
        mockValue = moment('2023-05-30T15:40:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Online');
    });
    it('should return "Seen n days ago" when last seen is in days', () => {
        mockValue = moment('2023-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 3 days ago');
    });
    it('should return "Seen 1 day ago" when user was last online 1 day ago', () => {
        mockValue = moment('2023-05-31T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 1 day ago');
    });
    it('should return "Seen more than 6 months ago" when last seen is in years', () => {
        mockValue = moment('2025-06-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen more than 6 months ago');
    });
    it('should return "Seen n months ago" when last seen is in months', () => {
        mockValue = moment('2023-11-02T16:49:38+04:00');
        (toMoment as jest.Mock).mockReturnValue(mockValue);
        expect(getLastOnlineLabel(isOnline, mockFn, lastOnlineTime)).toBe('Seen 5 months ago');
    });
    it('should return "Seen more than 6 months ago" when user is not online and last seen is not known', () => {
        expect(getLastOnlineLabel(isOnline, mockFn)).toBe('Seen more than 6 months ago');
    });
});
