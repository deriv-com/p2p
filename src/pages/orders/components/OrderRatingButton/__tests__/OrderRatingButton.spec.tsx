import { render, screen } from '@testing-library/react';
import OrderRatingButton from '../OrderRatingButton';

const mockProps = {
    buttonLabel: 'Test label',
    onClick: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('OrderRatingButton', () => {
    it('should render the component with the passed label', () => {
        render(<OrderRatingButton {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Test label' })).toBeInTheDocument();
    });
});
