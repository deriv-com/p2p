import { FC, PropsWithChildren } from 'react';
import { ExtendedOrderDetails } from '@/hooks/custom-hooks/useExtendedOrderDetails';
import { renderHook } from '@testing-library/react';
import { OrderDetailsProvider, useOrderDetails } from '../OrderDetailsProvider';

describe('useOrderDetails', () => {
    it('should return the orderDetails from context', () => {
        const mockValues = { isErrorOrderInfo: false, orderDetails: { isActiveOrder: true } as ExtendedOrderDetails };

        const wrapper: FC<PropsWithChildren> = ({ children }) => (
            <OrderDetailsProvider value={mockValues}>{children}</OrderDetailsProvider>
        );

        const { result } = renderHook(() => useOrderDetails(), { wrapper });

        expect(result.current).toEqual(mockValues);
    });
});
