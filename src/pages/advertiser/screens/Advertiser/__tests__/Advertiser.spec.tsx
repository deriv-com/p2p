import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Advertiser from '../Advertiser';

const mockUseHistory = {
    location: { search: '?id=123' },
    push: jest.fn(),
};

const mockUseLocation = {
    state: { from: '' },
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockUseHistory,
    useLocation: () => mockUseLocation,
    useParams: () => ({ advertiserId: '123' }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advertiser: {
            useGetInfo: jest.fn(() => ({
                data: {
                    advertiser_info: {
                        id: '123',
                    },
                },
            })),
        },
    },
    useModalManager: jest.fn(() => ({
        showModal: jest.fn(),
    })),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useAdvertiserStats: jest.fn(() => ({
        data: {},
        unsubscribe: jest.fn(),
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isMobile: false })),
}));

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    ProfileContent: () => <div>ProfileContent</div>,
}));

jest.mock('../../AdvertiserAdvertsTable', () => ({
    AdvertiserAdvertsTable: () => <div>AdvertiserAdvertsTable</div>,
}));

describe('<Advertiser />', () => {
    it('should render the Advertiser page component', () => {
        render(<Advertiser />);

        expect(screen.getByText('Advertiser’s page')).toBeInTheDocument();
        expect(screen.getByText('ProfileContent')).toBeInTheDocument();
        expect(screen.getByText('AdvertiserAdvertsTable')).toBeInTheDocument();
    });

    it('should call navigate back to buy-sell page when the back button is clicked', async () => {
        render(<Advertiser />);
        const backButton = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backButton);
        expect(mockUseHistory.push).toHaveBeenCalledWith('/buy-sell');
    });

    it('should call navigate back to my-profile page when the back button is clicked', async () => {
        mockUseLocation.state.from = 'MyProfile';
        render(<Advertiser />);
        const backButton = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backButton);
        expect(mockUseHistory.push).toHaveBeenCalledWith('/my-profile?tab=My+counterparties');
    });
});
