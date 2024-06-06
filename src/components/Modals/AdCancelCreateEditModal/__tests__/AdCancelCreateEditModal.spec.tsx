import { MY_ADS_URL } from '@/constants';
import { useQueryString } from '@/hooks/custom-hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdCancelCreateEditModal from '../AdCancelCreateEditModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useQueryString: jest.fn().mockReturnValue({ queryString: { advertId: '' } }),
}));

const mockUseQueryString = useQueryString as jest.Mock;

const mockFn = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ push: mockFn }),
}));

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('AdCancelCreateEditModal', () => {
    it('should render the component as expected', () => {
        render(<AdCancelCreateEditModal {...mockProps} />);
        expect(screen.getByText('Cancel ad creation?')).toBeInTheDocument();
    });
    it('should render the component as expected when isEdit is true', () => {
        mockUseQueryString.mockReturnValueOnce({ queryString: { advertId: '123' } });
        render(<AdCancelCreateEditModal {...mockProps} />);
        expect(screen.getByText('Cancel your edits?')).toBeInTheDocument();
    });
    it('should redirect to my ads page on clicking cancel button', async () => {
        render(<AdCancelCreateEditModal {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(button);
        expect(mockFn).toHaveBeenCalledWith(MY_ADS_URL);
    });
    it("should close the modal on clicking don't cancel button", async () => {
        render(<AdCancelCreateEditModal {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Don’t cancel' });
        await userEvent.click(button);
        expect(mockProps.onRequestClose).toHaveBeenCalledTimes(1);
    });
    it('should call the resetValues function on clicking cancel button if provided', async () => {
        const resetValues = jest.fn();
        render(<AdCancelCreateEditModal {...mockProps} resetValues={resetValues} />);
        const button = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(button);
        expect(resetValues).toHaveBeenCalledTimes(1);
    });
});
