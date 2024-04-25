import { render, screen } from '@testing-library/react';
import PaymentMethodErrorModal from '../PaymentMethodErrorModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentMethodErrorModal', () => {
    it('should render the modal correctly', () => {
        const props = {
            errorMessage: 'error message',
            isModalOpen: true,
            onConfirm: jest.fn(),
            title: 'title',
        };
        render(<PaymentMethodErrorModal {...props} />);
        expect(screen.getByText('title')).toBeInTheDocument();
        expect(screen.getByText('error message')).toBeInTheDocument();
    });
});
