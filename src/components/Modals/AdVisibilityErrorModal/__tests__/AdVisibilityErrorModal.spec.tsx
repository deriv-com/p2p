import { TCurrency } from 'types';
import { useLiveChat } from '@/hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdVisibilityErrorModal from '../AdVisibilityErrorModal';

const mockProps = {
    currency: 'USD' as TCurrency,
    errorCode: 'advertiser_balance',
    isModalOpen: true,
    limit: '10',
    onRequestClose: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockFn = jest.fn();

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    useLiveChat: jest.fn().mockReturnValue({ LiveChatWidget: {} }),
}));

describe('AdVisibilityErrorModal', () => {
    it('should render the modal as expected for advertiser balance error', () => {
        render(<AdVisibilityErrorModal {...mockProps} />);
        expect(screen.getByText('Your ad isn’t visible to others')).toBeInTheDocument();
    });
    it('should open live chat for clicking on live chat text for advertiser daily limit error', async () => {
        (useLiveChat as jest.Mock).mockReturnValue({ LiveChatWidget: { call: mockFn } });
        render(<AdVisibilityErrorModal {...mockProps} errorCode='advertiser_daily_limit' />);
        expect(screen.getByText('Your ad is not listed on')).toBeInTheDocument();
        const liveChatButton = screen.getByRole('button', { name: 'live chat' });
        await userEvent.click(liveChatButton);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
    it('should close the modal on clicking ok', async () => {
        render(<AdVisibilityErrorModal {...mockProps} />);
        const okButton = screen.getByRole('button', { name: 'Ok' });
        await userEvent.click(okButton);
        expect(mockProps.onRequestClose).toHaveBeenCalledTimes(1);
    });
    it('should render the default message when there are no specific error codes', () => {
        render(<AdVisibilityErrorModal {...mockProps} errorCode='random_error' />);
        expect(screen.getAllByText('Something’s not right')).toHaveLength(2);
    });
});
