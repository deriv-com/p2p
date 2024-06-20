import { getOrderTimeCompletionList, isOrderSeen } from '../order-utils';

let mockValues: string | undefined = JSON.stringify({
    user123: ['order1', 'order2'],
    user456: ['order3'],
});

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => mockValues),
    },
});

const mockFn = jest.fn((text, args) => {
    return text.replace(/{{(.*?)}}/g, (_: string, match: string) => args[match.trim()]);
});
describe('isOrderSeen', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return true if order is seen for a user', () => {
        const orderId = 'order2';
        const loginId = 'user123';

        const result = isOrderSeen(orderId, loginId);

        expect(result).toBe(true);
    });

    it('should return false if order is not seen for a user', () => {
        const orderId = 'order4'; // Assuming order4 is not present in localStorage
        const loginId = 'user123';

        const result = isOrderSeen(orderId, loginId);

        expect(result).toBe(false);
    });

    it('should return false if loginId or orderId is not found in localStorage', () => {
        const orderId = 'order2'; // Present in localStorage for 'user123' and not for 'user789'
        const loginId = 'user789'; // Not present in localStorage

        const result = isOrderSeen(orderId, loginId);

        expect(result).toBe(false);
    });

    it('should return false if localStorage get returns undefined', () => {
        mockValues = undefined;
        const orderId = 'order2';
        const loginId = 'user123';

        const result = isOrderSeen(orderId, loginId);

        expect(result).toBe(false);
    });
});

describe('getOrderTimeCompletionList', () => {
    it('should return empty array if orderExpiryOptions is not present', () => {
        const orderExpiryOptions = undefined;

        const result = getOrderTimeCompletionList(mockFn, orderExpiryOptions);

        expect(result).toEqual([]);
    });

    it('should return formatted list if orderExpiryOptions is present', () => {
        const orderExpiryOptions = [900, 2700, 3600];

        const result = getOrderTimeCompletionList(mockFn, orderExpiryOptions);

        expect(result).toEqual([
            { text: '15 minutes', value: '900' },
            { text: '45 minutes', value: '2700' },
            { text: '1 hour', value: '3600' },
        ]);
    });
});
