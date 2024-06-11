import { mockAdvertiserPaymentMethods } from '@/__mocks__/mock-data';
import { MY_ADS_URL } from '@/constants';
import { api } from '@/hooks';
import { useModalManager } from '@/hooks/custom-hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyAdsTableRowView from '../MyAdsTableRowView';

const mockProps = {
    account_currency: 'USD',
    active_orders: 0,
    advertiser_details: {
        completed_orders_count: 0,
        has_not_been_recommended: false,
        id: '34',
        is_blocked: false,
        is_favourite: false,
        is_online: true,
        is_recommended: false,
        last_online_time: 1688480346,
        name: 'client CR90000212',
        rating_average: null,
        rating_count: 0,
        recommended_average: null,
        recommended_count: null,
        total_completion_rate: null,
    },
    advertiserPaymentMethods: mockAdvertiserPaymentMethods,
    amount: 22,
    amount_display: '22.00',
    balanceAvailable: 0,
    block_trade: false,
    contact_info: '',
    counterparty_type: 'sell' as const,
    country: 'id',
    created_time: new Date(1688460999),
    currentRateType: 'fixed' as const,
    dailyBuyLimit: '',
    dailySellLimit: '',
    days_until_archive: 1,
    description: '',
    effective_rate: 22,
    effective_rate_display: '22.00',
    eligible_countries: ['ID'],
    id: '138',
    is_active: true,
    is_floating: false,
    is_visible: true,
    isBarred: false,
    isListed: true,
    local_currency: 'IDR',
    max_order_amount: 22,
    max_order_amount_display: '22.00',
    max_order_amount_limit: 22,
    max_order_amount_limit_display: '22.00',
    min_completion_rate: 22,
    min_join_days: 4,
    min_order_amount: 22,
    min_order_amount_display: '22.00',
    min_order_amount_limit: 22,
    min_order_amount_limit_display: '22.00',
    min_rating: 4,
    order_expiry_period: 900,
    payment_info: '',
};
const mockHistory = {
    push: jest.fn(),
};
const mockUseLocation = {
    state: {},
};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockHistory,
    useLocation: () => mockUseLocation,
}));

jest.mock('@/hooks/custom-hooks', () => {
    const modalManager = {
        hideModal: jest.fn(),
        isModalOpenFor: jest.fn(),
        showModal: jest.fn(),
    };
    modalManager.showModal.mockImplementation(() => {
        modalManager.isModalOpenFor.mockReturnValue(true);
    });
    return {
        ...jest.requireActual('@/hooks'),
        useFloatingRate: () => ({
            rateType: 'fixed',
            reachedTargetDate: false,
        }),
        useModalManager: jest.fn().mockReturnValue(modalManager),
        useQueryString: jest.fn().mockReturnValue({ queryString: { formAction: 'create' } }),
    };
});

jest.mock('@/hooks', () => ({
    api: {
        advert: {
            useCreate: jest.fn().mockReturnValue({ error: null, isError: false, isSuccess: false, mutate: jest.fn() }),
            useDelete: jest.fn().mockReturnValue({ error: null, isError: false, mutate: jest.fn() }),
            useUpdate: jest.fn().mockReturnValue({ error: null, isError: false, mutate: jest.fn() }),
        },
        paymentMethods: {
            useGet: jest.fn().mockReturnValue({ data: [] }),
        },
        settings: {
            useSettings: jest.fn(() => ({
                data: {
                    localCurrency: 'USD',
                },
            })),
        },
    },
}));

jest.mock('@/hooks/api/useInvalidateQuery', () => jest.fn(() => jest.fn()));

jest.mock('@/components/Modals', () => ({
    AdCancelCreateEditModal: () => <div>AdCancelCreateEditModal</div>,
    AdCreateEditErrorModal: () => <div>AdCreateEditErrorModal</div>,
    AdCreateEditSuccessModal: () => <div>AdCreateEditSuccessModal</div>,
    AdErrorTooltipModal: () => <div>AdErrorTooltipModal</div>,
    AdRateSwitchModal: () => <div>AdRateSwitchModal</div>,
    AdVisibilityErrorModal: () => <div>AdVisibilityErrorModal</div>,
    ErrorModal: () => <div>ErrorModal</div>,
    MyAdsDeleteModal: () => <div>MyAdsDeleteModal</div>,
    ShareAdsModal: () => <div>ShareAdsModal</div>,
}));

jest.mock('@/components/CopyAdForm', () => ({
    CopyAdForm: () => <div>CopyAdForm</div>,
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('../MyAdsTableRow', () => {
    return jest.fn().mockImplementation(({ onClickIcon }) => {
        return (
            <div data-testid='my-ads-table-row'>
                <button onClick={() => onClickIcon('share')}>Share Icon</button>
                <button onClick={() => onClickIcon('edit')}>Edit Icon</button>
                <button onClick={() => onClickIcon('delete')}>Delete Icon</button>
                <button onClick={() => onClickIcon('activate')}>Activate Icon</button>
                <button onClick={() => onClickIcon('deactivate')}>Deactivate Icon</button>
                <button onClick={() => onClickIcon('copy')}>Copy Icon</button>
            </div>
        );
    });
});

describe('MyAdsTableRowView', () => {
    it('should handle share ads', async () => {
        render(<MyAdsTableRowView {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Share Icon' });
        await userEvent.click(button);
        expect(useModalManager().showModal).toHaveBeenCalledWith('ShareAdsModal');
    });
    it('should handle edit ads', async () => {
        render(<MyAdsTableRowView {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Edit Icon' });
        await userEvent.click(button);
        expect(mockHistory.push).toHaveBeenCalledWith(`${MY_ADS_URL}/adForm?formAction=edit&advertId=138`);
    });
    it('should handle delete ads', async () => {
        render(<MyAdsTableRowView {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Delete Icon' });
        await userEvent.click(button);
        expect(useModalManager().showModal).toHaveBeenCalledWith('MyAdsDeleteModal');
    });
    it('should handle activate ads', async () => {
        render(<MyAdsTableRowView {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Activate Icon' });
        await userEvent.click(button);
        expect(api.advert.useUpdate().mutate).toHaveBeenCalledWith({ id: '138', is_active: 1 });
    });
    it('should handle deactive ads', async () => {
        render(<MyAdsTableRowView {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Deactivate Icon' });
        await userEvent.click(button);
        expect(api.advert.useUpdate().mutate).toHaveBeenCalledWith({ id: '138', is_active: 0 });
    });
});
