import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersTableHeader from '../OrdersTableHeader';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockFn = jest.fn();
jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useQueryString: () => ({ setQueryString: mockFn }),
}));

const mockProps = {
    activeTab: 'Active orders',
    fromDate: '2024-05-12',
    setFromDate: jest.fn(),
    setToDate: jest.fn(),
    toDate: '2024-06-01',
};

jest.mock('../../../../components/OrdersDateSelection', () => ({
    OrdersDateSelection: () => <div>OrdersDateSelection</div>,
}));

describe('OrdersTableHeader', () => {
    it('should render OrdersTableHeader', () => {
        render(<OrdersTableHeader {...mockProps} />);
        expect(screen.getByTestId('dt_orders_table_header')).toBeInTheDocument();
        expect(screen.getByText('Active orders')).toBeInTheDocument();
        expect(screen.getByText('Past orders')).toBeInTheDocument();
    });
    it('should handle clicking on tabs', async () => {
        render(<OrdersTableHeader {...mockProps} />);
        const pastOrdersTab = screen.getByText('Past orders');
        expect(pastOrdersTab).toBeInTheDocument();
        await userEvent.click(pastOrdersTab);
        expect(mockFn).toHaveBeenCalledWith({ tab: 'Past orders' });
    });
    it('should render OrdersDateSelection when user is on Past orders tab', () => {
        render(<OrdersTableHeader {...mockProps} activeTab='Past orders' />);
        expect(screen.getByText('OrdersDateSelection')).toBeInTheDocument();
    });
    it('should not render OrdersDateSelection when user is on Active orders tab', () => {
        render(<OrdersTableHeader {...mockProps} />);
        expect(screen.queryByText('OrdersDateSelection')).not.toBeInTheDocument();
    });
});
