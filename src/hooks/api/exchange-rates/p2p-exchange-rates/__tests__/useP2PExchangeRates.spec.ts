import { renderHook } from '@testing-library/react';
import useP2PExchangeRates from '../useP2PExchangeRates';

const mockUseExchangeRatesData = {
    data: {
        exchange_rates: {
            rates: {
                IDR: 30.2,
            },
        },
    },
    subscribeRates: jest.fn(),
};

jest.mock('@deriv-com/api-hooks', () => ({
    useExchangeRates: jest.fn(() => mockUseExchangeRatesData),
}));

describe('useP2PExchangeRates', () => {
    it('should return exchangeRate and subscribeRates to have been called', () => {
        const { result } = renderHook(() => useP2PExchangeRates('IDR'));

        expect(result.current.exchangeRate).toBe(30.2);
        expect(mockUseExchangeRatesData.subscribeRates).toHaveBeenCalledWith({
            base_currency: 'USD',
            target_currencies: ['IDR'],
        });
    });

    it('should return exchangeRate as undefined when targetCurrency is not provided', () => {
        const { result } = renderHook(() => useP2PExchangeRates(''));

        expect(result.current.exchangeRate).toBeUndefined();
    });
});
