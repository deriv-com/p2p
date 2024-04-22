import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import OrdersTableHeader from '../OrdersTableHeader';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockFn = jest.fn();
jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useQueryString: () => ({ setQueryString: mockFn }),
}));

describe('OrdersTableHeader', () => {
    it('should render OrdersTableHeader', () => {
        render(<OrdersTableHeader activeTab={'Active orders'} />);
        expect(screen.getByTestId('dt_orders_table_header')).toBeInTheDocument();
        expect(screen.getByText('Active orders')).toBeInTheDocument();
        expect(screen.getByText('Past orders')).toBeInTheDocument();
    });
    it('should handle clicking on tabs', async () => {
        render(<OrdersTableHeader activeTab={'Active orders'} />);
        const pastOrdersTab = screen.getByText('Past orders');
        expect(pastOrdersTab).toBeInTheDocument();
        await userEvent.click(pastOrdersTab);
        expect(mockFn).toHaveBeenCalledWith({ tab: 'Past orders' });
    });
});
