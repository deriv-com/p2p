import { getBlockedType } from '../account';

describe('getBlockedType', () => {
    it('should return the correct blocked type', () => {
        const mockData = {
            currency: 'BTC',
            is_virtual: 1,
        };

        // @ts-expect-error only required fields are provided
        expect(getBlockedType({ ...mockData })).toEqual('crypto');

        // @ts-expect-error only required fields are provided
        expect(getBlockedType({ ...mockData, currency: 'USD', is_virtual: 1 })).toEqual('demo');
    });
});
