import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersTableHeader from '../OrdersTableHeader';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockUseQueryString = {
    queryString: {
        tab: 'Active orders',
    },
    setQueryString: jest.fn(),
};
jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useQueryString: jest.fn(() => mockUseQueryString),
}));

const mockTabsStore = {
    activeOrdersTab: 'Active orders',
    setActiveOrdersTab: jest.fn(),
};

jest.mock('@/stores', () => ({
    useTabsStore: jest.fn(selector => (selector ? selector(mockTabsStore) : mockTabsStore)),
}));

const mockProps = {
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
    it('should call setActiveOrdersTab if queryString.tab has a value', () => {
        render(<OrdersTableHeader {...mockProps} />);
        expect(mockTabsStore.setActiveOrdersTab).toHaveBeenCalledWith('Active orders');
    });
    it('should call setQueryString if queryString.tab is empty', () => {
        mockUseQueryString.queryString.tab = '';
        render(<OrdersTableHeader {...mockProps} />);
        expect(mockUseQueryString.setQueryString).toHaveBeenCalledWith({ tab: 'Active orders' });
    });
    it('should handle clicking on tabs', async () => {
        render(<OrdersTableHeader {...mockProps} />);
        const pastOrdersTab = screen.getByText('Past orders');
        expect(pastOrdersTab).toBeInTheDocument();
        await userEvent.click(pastOrdersTab);
        expect(mockTabsStore.setActiveOrdersTab).toHaveBeenCalled();
        expect(mockUseQueryString.setQueryString).toHaveBeenCalled();
    });
    it('should render OrdersDateSelection when user is on Past orders tab', () => {
        mockTabsStore.activeOrdersTab = 'Past orders';
        render(<OrdersTableHeader {...mockProps} />);
        expect(screen.getByText('OrdersDateSelection')).toBeInTheDocument();
    });
    it('should not render OrdersDateSelection when user is on Active orders tab', () => {
        mockTabsStore.activeOrdersTab = 'Active orders';
        render(<OrdersTableHeader {...mockProps} />);
        expect(screen.queryByText('OrdersDateSelection')).not.toBeInTheDocument();
    });
});
