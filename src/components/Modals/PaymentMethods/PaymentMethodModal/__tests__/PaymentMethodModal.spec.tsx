import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodModal from '../PaymentMethodModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('PaymentMethodModal', () => {
    it('should render the component correctly', () => {
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={jest.fn()}
                onReject={jest.fn()}
                primaryButtonLabel='Yes'
                secondaryButtonLabel='Yes, remove'
                title='Payment Method Modal'
            />
        );
        expect(screen.getByText('Payment Method Modal')).toBeInTheDocument();
        expect(screen.getByText('Payment Method Modal Description')).toBeInTheDocument();
    });
    it('should handle onclick when the yes, remove button is clicked', async () => {
        const onConfirm = jest.fn();
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={onConfirm}
                onReject={jest.fn()}
                primaryButtonLabel='Yes'
                secondaryButtonLabel='Yes, remove'
                title='Payment Method Modal'
            />
        );
        const confirmButton = screen.getByText('Yes, remove');
        await userEvent.click(confirmButton);
        expect(onConfirm).toHaveBeenCalled();
    });
    it('should handle onclick when the yes button is clicked', async () => {
        const onReject = jest.fn();
        render(
            <PaymentMethodModal
                description='Payment Method Modal Description'
                isModalOpen={true}
                onConfirm={jest.fn()}
                onReject={onReject}
                primaryButtonLabel='Yes'
                secondaryButtonLabel='Yes, remove'
                title='Payment Method Modal'
            />
        );
        const rejectButton = screen.getByText('Yes');
        await userEvent.click(rejectButton);
        expect(onReject).toHaveBeenCalled();
    });
});
