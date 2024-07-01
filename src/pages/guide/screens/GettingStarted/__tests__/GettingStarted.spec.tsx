import { render, screen } from '@testing-library/react';
import GettingStarted from '../GettingStarted';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('GettingStarted', () => {
    it('should render the GettingStarted component', () => {
        render(<GettingStarted />);
        expect(screen.getByText('1. Find or create a buy ad')).toBeInTheDocument();
        expect(screen.getByText('2. Pay the seller')).toBeInTheDocument();
        expect(screen.getByText('3. Receive your funds')).toBeInTheDocument();
    });
});
