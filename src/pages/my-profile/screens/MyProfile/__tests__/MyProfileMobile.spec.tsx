import { TAdvertiserStats } from 'types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileMobile from '../MyProfileMobile';

jest.mock('@/components/ProfileContent', () => ({
    ProfileContent: jest.fn(() => <div>ProfileContent</div>),
}));
jest.mock('../../MyProfileStats/MyProfileStatsMobile', () => ({
    __esModule: true,
    default: jest.fn(() => <div>MyProfileStatsMobile</div>),
}));
jest.mock('../../MyProfileAdDetails', () => ({
    MyProfileAdDetails: jest.fn(() => <div>MyProfileAdDetailsScreen</div>),
}));
jest.mock('../../MyProfileCounterparties', () => ({
    MyProfileCounterparties: jest.fn(() => <div>MyProfileCounterpartiesScreen</div>),
}));
jest.mock('../../PaymentMethods', () => ({
    PaymentMethods: jest.fn(() => <div>PaymentMethodsScreen</div>),
}));

function resetMockedData() {
    mockQueryString = {
        tab: 'default',
    };
}

let mockQueryString = {
    tab: 'default',
};

const mockSetQueryString = jest.fn();
jest.mock('@/hooks/custom-hooks', () => ({
    useQueryString: jest.fn(() => ({
        queryString: mockQueryString,
        setQueryString: mockSetQueryString,
    })),
}));

const mockProps = {
    data: {} as TAdvertiserStats,
};

describe('MyProfileMobile', () => {
    afterEach(() => {
        resetMockedData();
    });
    it('should render the default tab', () => {
        render(<MyProfileMobile {...mockProps} />);
        expect(screen.getByText('ProfileContent')).toBeInTheDocument();
    });
    it('should render the appropriate screens', async () => {
        render(<MyProfileMobile {...mockProps} />);

        const clickTabAndRender = async (tab: string) => {
            const btn = screen.getByRole('button', {
                name: tab,
            });
            await userEvent.click(btn);
            expect(mockSetQueryString).toBeCalledWith({
                tab,
            });
            mockQueryString = {
                tab,
            };
            render(<MyProfileMobile {...mockProps} />);
        };

        await clickTabAndRender('Stats');
        expect(screen.getByText('MyProfileStatsMobile')).toBeInTheDocument();

        await clickTabAndRender('Payment methods');
        expect(screen.getByText('PaymentMethodsScreen')).toBeInTheDocument();

        await clickTabAndRender('Ad details');
        expect(screen.getByText('MyProfileAdDetailsScreen')).toBeInTheDocument();

        await clickTabAndRender('My counterparties');
        expect(screen.getByText('MyProfileCounterpartiesScreen')).toBeInTheDocument();
    });
});
