import { getBlockedType } from '../account';

describe('getBlockedType', () => {
    it('should return the correct blocked type', () => {
        const mockData = {
            currency: 'USD',
            is_virtual: 0,
        };

        // @ts-expect-error only required fields are provided
        expect(getBlockedType({ ...mockData, currency_type: 'crypto' })).toEqual('crypto');

        // @ts-expect-error only required fields are provided
        expect(getBlockedType({ ...mockData, currency: 'USD', is_virtual: 1 })).toEqual('demo');

        // @ts-expect-error only required fields are provided
        expect(getBlockedType({ ...mockData, currency: 'EUR' })).toEqual('nonUSD');
    });
});
