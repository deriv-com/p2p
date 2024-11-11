import { fireEvent, render, screen } from '@testing-library/react';
import FundsBanner from '../FundsBanner';

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useModalManager: jest.fn(() => mockModalManager),
}));

describe('<FundsBanner />', () => {
    it('should render the FundsBanner', () => {
        render(<FundsBanner />);

        expect(
            screen.getByText(/Your P2P funds are accessible through your Options trading account./)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Learn more/ })).toBeInTheDocument();
    });

    it('should call showModal when the Learn more button is clicked and show the FundsModal', () => {
        render(<FundsBanner />);
        fireEvent.click(screen.getByRole('button', { name: /Learn more/ }));

        expect(mockModalManager.showModal).toHaveBeenCalledWith('FundsModal');
    });

    it('should render the FundsModal if it is open', () => {
        mockModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'FundsModal');
        render(<FundsBanner />);

        expect(screen.getByText('How to fund your trades?')).toBeInTheDocument();
        expect(screen.getByText('For Options trading:')).toBeInTheDocument();
        expect(screen.getByText('Trade directly with funds from your Options trading account.')).toBeInTheDocument();
        expect(screen.getByText('For CFDs trading:')).toBeInTheDocument();
        expect(
            screen.getByText('1. Transfer funds from your Options trading account to your USD Wallet.')
        ).toBeInTheDocument();
        expect(
            screen.getByText('2. Then, move the funds from your USD Wallet to your CFDs account.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should call hideModal when the OK button is clicked', () => {
        render(<FundsBanner />);

        fireEvent.click(screen.getByRole('button', { name: 'OK' }));
        expect(mockModalManager.hideModal).toHaveBeenCalled();
    });
});
