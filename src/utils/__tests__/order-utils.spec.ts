import { isOrderSeen } from '../order-utils';

let mockValues: string | undefined = JSON.stringify({
    user123: ['order1', 'order2'],
    user456: ['order3'],
});

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(() => mockValues),
    },
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
