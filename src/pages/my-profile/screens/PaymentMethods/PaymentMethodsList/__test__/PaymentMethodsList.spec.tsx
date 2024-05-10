import { useQueryString } from '@/hooks/custom-hooks';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodsList from '../PaymentMethodsList';

jest.mock('../PaymentMethodsListContent/PaymentMethodsListContent', () =>
    jest.fn().mockReturnValue(<div>PaymentMethodsListContent</div>)
);

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useQueryString: jest.fn().mockReturnValue({ setQueryString: jest.fn() }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true, isMobile: false, isTablet: false }),
}));

const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
const mockUseQueryString = useQueryString as jest.MockedFunction<typeof useQueryString>;

describe('PaymentMethodsList', () => {
    it('should render the component when an empty list of payment methods is provided and isMobile is true', () => {
        (mockUseDevice as jest.Mock).mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
            isTabletPortrait: false,
        });
        render(
            <PaymentMethodsList
                formState={{}}
                onAdd={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
                onResetFormState={jest.fn()}
                p2pAdvertiserPaymentMethods={[]}
            />
        );
        expect(screen.queryByText('PaymentMethodsListContent')).not.toBeInTheDocument();
    });
    it('should render the component when an empty list of payment methods is provided and isMobile is false', () => {
        (mockUseDevice as jest.Mock).mockReturnValueOnce({
            isDesktop: false,
            isMobile: false,
            isTablet: false,
            isTabletPortrait: false,
        });
        render(
            <PaymentMethodsList
                formState={{}}
                onAdd={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
                onResetFormState={jest.fn()}
                p2pAdvertiserPaymentMethods={[]}
            />
        );
        expect(screen.queryByText('PaymentMethodsListContent')).not.toBeInTheDocument();
    });
    it('should render the component when a list of payment methods is provided and isMobile is true', () => {
        (mockUseDevice as jest.Mock).mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
            isTabletPortrait: false,
        });
        render(
            <PaymentMethodsList
                formState={{}}
                onAdd={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
                onResetFormState={jest.fn()}
                p2pAdvertiserPaymentMethods={[
                    {
                        display_name: 'test',
                        fields: {},
                        id: '1',
                        is_enabled: 0,
                        method: '',
                        type: 'other',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                ]}
            />
        );
        expect(screen.getByText('PaymentMethodsListContent')).toBeInTheDocument();
    });
    it('should render the component when a list of payment methods is provided and isMobile is false', () => {
        (mockUseDevice as jest.Mock).mockReturnValueOnce({
            isDesktop: false,
            isMobile: false,
            isTablet: false,
            isTabletPortrait: false,
        });
        render(
            <PaymentMethodsList
                formState={{}}
                onAdd={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
                onResetFormState={jest.fn()}
                p2pAdvertiserPaymentMethods={[
                    {
                        display_name: 'test',
                        fields: {},
                        id: '1',
                        is_enabled: 0,
                        method: '',
                        type: 'other',
                        used_by_adverts: null,
                        used_by_orders: null,
                    },
                ]}
            />
        );
        expect(screen.getByText('PaymentMethodsListContent')).toBeInTheDocument();
    });
    it('should handle onclick for the back button for mobile', async () => {
        const { setQueryString: mockSetQueryString } = mockUseQueryString();
        (mockUseDevice as jest.Mock).mockReturnValueOnce({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
            isTabletPortrait: false,
        });
        render(
            <PaymentMethodsList
                formState={{}}
                onAdd={jest.fn()}
                onDelete={jest.fn()}
                onEdit={jest.fn()}
                onResetFormState={jest.fn()}
                p2pAdvertiserPaymentMethods={[]}
            />
        );
        const backButton = screen.getByTestId('dt_mobile_wrapper_button');
        await userEvent.click(backButton);
        expect(mockSetQueryString).toHaveBeenCalledWith({ tab: 'default' });
    });
});
