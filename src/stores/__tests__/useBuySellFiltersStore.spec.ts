import { act, renderHook } from '@testing-library/react';
import useBuySellFiltersStore from '../useBuySellFiltersStore';

describe('useBuySellFiltersStore', () => {
    it('should update the store state correctly', () => {
        const { result } = renderHook(() => useBuySellFiltersStore());

        // Test initial state
        expect(result.current.filteredCurrency).toBe('');
        expect(result.current.selectedPaymentMethods).toEqual([]);
        expect(result.current.shouldUseClientLimits).toBe(true);
        expect(result.current.sortByValue).toBe('rate');

        // Dispatch actions to update state
        act(() => {
            result.current.setFilteredCurrency('USD');
            result.current.setSelectedPaymentMethods(['PayPal', 'Bank Transfer']);
            result.current.setShouldUseClientLimits(false);
            result.current.setSortByValue('rate');
        });

        // Test updated state
        expect(result.current.filteredCurrency).toBe('USD');
        expect(result.current.selectedPaymentMethods).toEqual(['PayPal', 'Bank Transfer']);
        expect(result.current.shouldUseClientLimits).toBe(false);
        expect(result.current.sortByValue).toBe('rate');
    });
});
