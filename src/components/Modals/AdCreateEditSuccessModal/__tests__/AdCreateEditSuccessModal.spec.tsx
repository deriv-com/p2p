import { TCurrency } from 'types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdCreateEditSuccessModal from '../AdCreateEditSuccessModal';

const mockProps = {
    advertsArchivePeriod: 7,
    currency: 'USD' as TCurrency,
    isModalOpen: true,
    limit: '1000',
    onRequestClose: jest.fn(),
    visibilityStatus: '',
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('@/hooks/api/useInvalidateQuery', () => jest.fn(() => jest.fn()));

describe('AdCreateEditSuccessModal', () => {
    it('should render with passed props', () => {
        render(<AdCreateEditSuccessModal {...mockProps} />);
        expect(screen.getByText(/You’ve created an ad/i)).toBeInTheDocument();
        expect(
            screen.getByText(/If the ad doesn't receive an order for 7 days, it will be deactivated./i)
        ).toBeInTheDocument();
    });
    it('should handle checkbox change', async () => {
        render(<AdCreateEditSuccessModal {...mockProps} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
        await userEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });
    it('should handle ok button click', async () => {
        render(<AdCreateEditSuccessModal {...mockProps} />);
        const okButton = screen.getByRole('button', { name: 'Ok' });
        expect(okButton).toBeInTheDocument();
        await userEvent.click(okButton);
        expect(mockProps.onRequestClose).toBeCalledTimes(1);
    });
});
