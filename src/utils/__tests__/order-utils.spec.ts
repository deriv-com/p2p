import { getOrderTimeCompletionList } from '../order-utils';

const mockFn = jest.fn((text, args) => {
    return text.replace(/{{(.*?)}}/g, (_: string, match: string) => args[match.trim()]);
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
