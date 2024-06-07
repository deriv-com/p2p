import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import OrderDetailsCard from '../OrderDetailsCard';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

jest.mock('../OrderDetailsCardHeader', () => ({
    OrderDetailsCardHeader: () => <div>OrderDetailsCardHeader</div>,
}));
jest.mock('../OrderDetailsCardInfo', () => ({
    OrderDetailsCardInfo: () => <div>OrderDetailsCardInfo</div>,
}));
jest.mock('../OrderDetailsCardFooter', () => ({
    OrderDetailsCardFooter: () => <div>OrderDetailsCardFooter</div>,
}));

const mockUseDevice = useDevice as jest.Mock;

const mockProps = { sendFile: jest.fn() };

describe('<OrderDetailsCard />', () => {
    it('should render the OrderDetailsCard component', () => {
        render(<OrderDetailsCard {...mockProps} />);
        expect(screen.getByText('OrderDetailsCardHeader')).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCardInfo')).toBeInTheDocument();
        expect(screen.getByText('OrderDetailsCardFooter')).toBeInTheDocument();
    });

    it('should not render the OrderDetailsCardFooter component on mobile', () => {
        mockUseDevice.mockReturnValue({ isDesktop: false });

        render(<OrderDetailsCard {...mockProps} />);

        expect(screen.queryByText('OrderDetailsCardFooter')).not.toBeInTheDocument();
    });
});
