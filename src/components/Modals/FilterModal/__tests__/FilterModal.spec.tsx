import { useDevice } from '@deriv-com/ui';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterModal from '../FilterModal';

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

let mockData: { display_name: string; id: string }[] | undefined = [
    {
        display_name: 'Alipay',
        id: 'alipay',
    },
    {
        display_name: 'Bank Transfer',
        id: 'bank_transfer',
    },
];

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@/hooks', () => ({
    api: {
        paymentMethods: {
            useGet: jest.fn(() => ({
                data: mockData,
            })),
        },
    },
    useModalManager: jest.fn(() => mockModalManager),
}));

const mockStore = {
    selectedPaymentMethods: [],
    setSelectedPaymentMethods: jest.fn(),
    setShouldUseClientLimits: jest.fn(),
    shouldUseClientLimits: true,
};

jest.mock('@/stores', () => ({
    useBuySellFiltersStore: jest.fn(selector => (selector ? selector(mockStore) : mockStore)),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

const user = userEvent.setup({ delay: null });

describe('<FilterModal />', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });
    it('should render the initial page of the FilterModal', async () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const resetButton = screen.getByRole('button', { name: 'Reset' });
        const applyButton = screen.getByRole('button', { name: 'Apply' });

        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Matching ads')).toBeInTheDocument();
        expect(screen.getByText('Ads that match your Deriv P2P balance and limit.')).toBeInTheDocument();
        expect(toggleSwitch).toBeInTheDocument();
        expect(toggleSwitch).toBeChecked();
        expect(resetButton).toBeInTheDocument();
        expect(applyButton).toBeInTheDocument();
        expect(applyButton).toBeDisabled();
    });

    it('should enable the apply button when user toggles the ToggleSwitch', async () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const applyButton = screen.getByRole('button', { name: 'Apply' });

        await user.click(toggleSwitch);

        expect(toggleSwitch).not.toBeChecked();
        expect(applyButton).toBeEnabled();
    });

    it('should call setSelectedPaymentMethods, onToggle, and onRequestClose when user clicks the Apply button', async () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const applyButton = screen.getByRole('button', { name: 'Apply' });

        await user.click(toggleSwitch);
        await user.click(applyButton);

        expect(mockStore.setSelectedPaymentMethods).toHaveBeenCalled();
        expect(mockStore.setShouldUseClientLimits).toHaveBeenCalled();
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });

    it('should call setPaymentMethods when user clicks on Reset button', async () => {
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        const resetButton = screen.getByRole('button', { name: 'Reset' });

        await user.click(toggleSwitch);
        expect(toggleSwitch).not.toBeChecked();

        await user.click(resetButton);

        expect(mockStore.setSelectedPaymentMethods).toHaveBeenCalled();
        expect(toggleSwitch).toBeChecked();
    });

    it('should render the payment methods page of the FilterModal', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const clearButton = screen.getByRole('button', { name: 'Clear' });
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const bankTransferCheckbox = screen.getByRole('checkbox', { name: 'Bank Transfer' });

        expect(screen.queryByText('Filter')).not.toBeInTheDocument();
        expect(screen.getByText('Payment methods')).toBeInTheDocument();
        expect(screen.getByText('Search payment method')).toBeInTheDocument();
        expect(alipayCheckbox).toBeInTheDocument();
        expect(alipayCheckbox).not.toBeChecked();
        expect(bankTransferCheckbox).toBeInTheDocument();
        expect(bankTransferCheckbox).not.toBeChecked();
        expect(clearButton).toBeInTheDocument();
        expect(clearButton).toBeDisabled();
        expect(confirmButton).toBeInTheDocument();
        expect(confirmButton).toBeDisabled();
    });

    it('should show the search results when user types in the search input', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'alipay');

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByText('Alipay')).toBeInTheDocument();
        expect(screen.queryByText('Bank Transfer')).not.toBeInTheDocument();
    });

    it('should show No results for message if payment method is not in the list', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'paypal');

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByText(/No results for "paypal"./s)).toBeInTheDocument();
        expect(screen.getByText('Check your spelling or use a different term.')).toBeInTheDocument();

        await user.clear(searchInput);

        act(() => {
            jest.runAllTimers();
        });
    });

    it('should enable the clear and confirm buttons when user selects a payment method', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });
        const clearButton = screen.getByRole('button', { name: 'Clear' });

        await user.click(alipayCheckbox);

        expect(alipayCheckbox).toBeChecked();
        expect(confirmButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it('should clear the selected payment methods when user clicks on the clear button', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const clearButton = screen.getByRole('button', { name: 'Clear' });

        await user.click(alipayCheckbox);
        await user.click(clearButton);

        expect(alipayCheckbox).not.toBeChecked();
    });

    it('should go back to the initial page when user clicks on the back button', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const backButton = screen.getByTestId('dt_page_return_btn');

        await user.click(backButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('should call go back to the initial page and display the selected payment methods when user clicks on the confirm button', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });
        const confirmButton = screen.getByRole('button', { name: 'Confirm' });

        await user.click(alipayCheckbox);
        await user.click(confirmButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByText('Alipay')).toBeInTheDocument();
    });

    it('should call setSelectedPaymentMethods if a payment method is unselected', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const alipayCheckbox = screen.getByRole('checkbox', { name: 'Alipay' });

        await user.click(alipayCheckbox);
        await user.click(alipayCheckbox);

        expect(mockStore.setSelectedPaymentMethods).toHaveBeenCalled();
    });

    it('should populate the payment methods list with the data from the API', async () => {
        mockData = [];
        const { rerender } = render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const alipayCheckbox = screen.queryByRole('checkbox', { name: 'Alipay' });
        const bankTransferCheckbox = screen.queryByRole('checkbox', { name: 'Bank Transfer' });

        expect(alipayCheckbox).not.toBeInTheDocument();
        expect(bankTransferCheckbox).not.toBeInTheDocument();

        mockData = [
            {
                display_name: 'Alipay',
                id: 'alipay',
            },
            {
                display_name: 'Bank Transfer',
                id: 'bank_transfer',
            },
        ];

        rerender(<FilterModal {...mockProps} />);

        const alipayCheckboxRerendered = screen.getByRole('checkbox', { name: 'Alipay' });
        const bankTransferCheckboxRerendered = screen.getByRole('checkbox', { name: 'Bank Transfer' });

        expect(alipayCheckboxRerendered).toBeInTheDocument();
        expect(bankTransferCheckboxRerendered).toBeInTheDocument();
    });

    it('should call onRequestClose if backButton is pressed on initial page in mobile', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
        });

        render(<FilterModal {...mockProps} />);

        const backButton = screen.getByTestId('dt_mobile_wrapper_button');
        await user.click(backButton);

        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });

    it('should go back to initial page if backButton is pressed in payment methods page in mobile', async () => {
        render(<FilterModal {...mockProps} />);

        const paymentMethodsText = screen.getByText('Payment methods');
        await user.click(paymentMethodsText);

        const backButton = screen.getAllByTestId('dt_mobile_wrapper_button')[0];
        await user.click(backButton);

        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('should show LeaveFilterModal when user tries to exit the FilterModal in mobile view', async () => {
        mockModalManager.isModalOpenFor.mockImplementation(modalName => modalName === 'LeaveFilterModal');
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        await user.click(toggleSwitch);

        const closeIcon = screen.getByTestId('dt_mobile_wrapper_button');
        await user.click(closeIcon);

        expect(mockModalManager.showModal).toHaveBeenCalledWith('LeaveFilterModal');
        expect(screen.getByText('Leave page?')).toBeInTheDocument();
    });

    it('should call hideModal when user clicks on the cancel button in LeaveFilterModal', async () => {
        mockModalManager.isModalOpenFor.mockImplementation(modalName => modalName === 'LeaveFilterModal');
        render(<FilterModal {...mockProps} />);

        const toggleSwitch = screen.getByRole('checkbox');
        await user.click(toggleSwitch);

        const closeIcon = screen.getByTestId('dt_mobile_wrapper_button');
        await user.click(closeIcon);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await user.click(cancelButton);

        expect(mockModalManager.hideModal).toHaveBeenCalledWith({ shouldHideAllModals: false });
    });
});
