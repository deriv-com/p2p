import { numberToCurrencyText } from '../currency';

describe('currency', () => {
    describe('numberToCurrencyText', () => {
        it('should convert a number to US-supported currency format', () => {
            expect(numberToCurrencyText(10000)).toBe('10,000.00');
        });
    });
});
