import { DeepPartial, THooks } from 'types';
import { api } from '@/hooks';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvertiserAdvertsTable from '../AdvertiserAdvertsTable';

let mockUseGetAdvertList = {
    data: undefined as DeepPartial<THooks.Advert.GetList> | undefined,
    isFetching: false,
    isLoading: true,
    loadMoreAdverts: jest.fn(),
};

const mockUseGetAdvertInfo = {
    data: {
        account_currency: 'USD',
        advertiser_details: {
            id: 'id',
        },
        local_currency: 'USD',
        rate_display: '1',
        rate_type: 'fixed',
        type: 'buy',
    },
    isLoading: false,
};

const mockPush = jest.fn();
let mockSearch = '';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({ push: mockPush })),
    useLocation: jest.fn(() => ({ search: mockSearch })),
}));

jest.mock('use-query-params', () => ({
    ...jest.requireActual('use-query-params'),
    useQueryParams: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@/components/BuySellForm', () => ({
    BuySellForm: jest.fn(() => <div>BuySellForm</div>),
}));

jest.mock('@/components/Modals', () => ({
    ...jest.requireActual('@/components/Modals'),
    ErrorModal: jest.fn(() => <div>ErrorModal</div>),
}));

jest.mock('@/hooks', () => ({
    api: {
        advert: {
            useGet: jest.fn(() => mockUseGetAdvertInfo),
            useGetList: jest.fn(() => mockUseGetAdvertList),
        },
        advertiser: {
            useGetInfo: jest.fn(() => ({ data: { id: '123' } })),
        },
        advertiserPaymentMethods: {
            useGet: jest.fn(() => ({ data: [] })),
        },
        exchangeRates: {
            useGet: jest.fn(() => ({
                exchangeRate: 1,
            })),
        },
        paymentMethods: {
            useGet: jest.fn(() => ({ data: [] })),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

const mockUseDevice = useDevice as jest.Mock;

const mockUseModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

const mockUseQueryString = {
    queryString: {},
    setQueryString: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useIsAdvertiser: jest.fn(() => true),
    useIsAdvertiserBarred: jest.fn(() => false),
    useModalManager: jest.fn(() => mockUseModalManager),
    usePoiPoaStatus: jest.fn(() => ({ data: { isPoaVerified: true, isPoiVerified: true } })),
    useQueryString: jest.fn(() => mockUseQueryString),
}));

const mockTabsStore = {
    activeAdvertisersBuySellTab: 'Buy',
    setActiveAdvertisersBuySellTab: jest.fn(),
};

jest.mock('@/stores', () => ({
    useTabsStore: jest.fn(selector => (selector ? selector(mockTabsStore) : mockTabsStore)),
}));

const mockUseGetList = api.advert.useGetList as jest.Mock;
const mockUseGet = api.advert.useGet as jest.MockedFunction<typeof api.advert.useGet>;
const mockUseIsAdvertiserBarred = useIsAdvertiserBarred as jest.MockedFunction<typeof useIsAdvertiserBarred>;

describe('<AdvertiserAdvertsTable />', () => {
    it('should show the Loader component if isLoading is true', () => {
        render(<AdvertiserAdvertsTable advertiserId='123' />);

        expect(screen.getByRole('button', { name: 'Buy' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sell' })).toBeInTheDocument();
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should call setQueryString if queryString is not defined', async () => {
        render(<AdvertiserAdvertsTable advertiserId='123' />);

        expect(mockUseQueryString.setQueryString).toHaveBeenCalledWith({ tab: 'Buy' });
    });

    it('should call setActiveAdvertisersBuySellTab if queryString is defined', async () => {
        mockUseQueryString.queryString = { tab: 'Buy' };
        render(<AdvertiserAdvertsTable advertiserId='123' />);

        expect(mockTabsStore.setActiveAdvertisersBuySellTab).toHaveBeenCalledWith('Buy');
    });

    it('should show There are no adverts yet message if data is empty', () => {
        mockUseGetAdvertList = {
            ...mockUseGetAdvertList,
            isLoading: false,
        };
        mockUseGetList.mockReturnValue(mockUseGetAdvertList);

        render(<AdvertiserAdvertsTable advertiserId='123' />);

        expect(screen.getByText('There are no ads yet')).toBeInTheDocument();
    });

    it('should show the AdvertsTableRenderer component if data is not empty', () => {
        mockUseDevice.mockReturnValue({ isDesktop: true });
        mockUseGetAdvertList = {
            ...mockUseGetAdvertList,
            data: [
                {
                    account_currency: 'USD',
                    counterparty_type: 'buy',
                    id: '123',
                    max_order_amount_limit_display: '100.00',
                    min_order_amount_limit_display: '10.00',
                    payment_method_names: ['Bank Transfer', 'Other'],
                },
            ],
            isLoading: false,
        };
        mockUseGetList.mockReturnValue(mockUseGetAdvertList);

        render(<AdvertiserAdvertsTable advertiserId='123' />);

        expect(screen.getByText('Limits')).toBeInTheDocument();
        expect(screen.getByText(/10.00-100.00 USD/)).toBeInTheDocument();

        expect(screen.getByText('Rate (1 USD)')).toBeInTheDocument();

        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
        expect(screen.getByText('Other')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Buy USD' })).toBeInTheDocument();
    });

    it('should show Sell Tab is active when tab is clicked on', async () => {
        mockUseGetAdvertList = {
            ...mockUseGetAdvertList,
            data: [
                {
                    account_currency: 'USD',
                    counterparty_type: 'sell',
                    id: '123',
                    max_order_amount_limit_display: '100.00',
                    min_order_amount_limit_display: '10.00',
                    payment_method_names: ['Bank Transfer', 'Other'],
                },
            ],
            isLoading: false,
        };
        mockUseGetList.mockReturnValue(mockUseGetAdvertList);

        render(<AdvertiserAdvertsTable advertiserId='123' />);

        await userEvent.click(screen.getByRole('button', { name: 'Sell' }));

        const activeClass = 'derivs-secondary-tabs__btn derivs-secondary-tabs__btn--active';

        expect(screen.getByRole('button', { name: 'Buy' })).not.toHaveClass(activeClass);
        expect(screen.getByRole('button', { name: 'Sell' })).toHaveClass(activeClass);

        expect(screen.getByRole('button', { name: 'Sell USD' })).toBeInTheDocument();
        expect(mockTabsStore.setActiveAdvertisersBuySellTab).toHaveBeenCalledWith('Sell');
    });

    it('should show LoadingModal if isLoading is true and advertId is present', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGetAdvertInfo,
            data: undefined,
            isLoading: true,
        });
        mockSearch = '?advert_id=456';
        mockUseModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'LoadingModal');

        render(<AdvertiserAdvertsTable advertiserId='222' />);

        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should show BuySellForm if user is an advertiser, not barred, isLoading is false, advertId is present, advert is active and visible', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGetAdvertInfo,
            data: {
                ...mockUseGetAdvertInfo.data,
                is_active: true,
                is_visible: true,
            },
            isLoading: false,
        });
        mockSearch = '?advert_id=456';
        mockUseModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'BuySellForm');

        render(<AdvertiserAdvertsTable advertiserId='222' />);

        const buySellForms = screen.queryAllByText('BuySellForm');
        expect(buySellForms.length).toBeGreaterThan(0);
    });

    it('should show ErrorModal if error is sent back from api and data is undefined', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGetAdvertInfo,
            data: undefined,
            error: 'Error',
            isLoading: false,
        });
        mockSearch = '?advert_id=456';
        mockUseModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'ErrorModal');

        render(<AdvertiserAdvertsTable advertiserId='222' />);

        expect(screen.getAllByText('ErrorModal')).toHaveLength(2);
    });

    it('should show ErrorModal if advert is not active and visible, and error is undefined', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGetAdvertInfo,
            data: {
                ...mockUseGetAdvertInfo.data,
                is_active: false,
                is_visible: false,
            },
            isLoading: false,
        });
        mockSearch = '?advert_id=456';
        mockUseModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'ErrorModal');

        render(<AdvertiserAdvertsTable advertiserId='222' />);

        expect(screen.getAllByText('ErrorModal')).toHaveLength(2);
    });

    it('should call history.push if the advertiser is barred', () => {
        mockUseIsAdvertiserBarred.mockReturnValue(true);
        render(<AdvertiserAdvertsTable advertiserId='222' />);
        expect(mockPush).toHaveBeenCalledWith('/buy-sell');
    });
});
