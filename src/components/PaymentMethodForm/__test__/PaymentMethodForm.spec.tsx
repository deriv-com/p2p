import { api } from '@/hooks';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethodForm from '../PaymentMethodForm';

const mockPaymentMethods = [
    {
        display_name: 'Bank Transfer',
        fields: {
            account: {
                display_name: 'Account Number',
                required: 1,
                type: 'text',
                value: '00112233445566778899',
            },
            bank_name: {
                display_name: 'Bank Transfer',
                required: 1,
                type: 'text',
                value: 'Bank Name',
            },
        },
        id: 'bank_transfer',
        is_enabled: 0,
        method: 'bank_transfer',
        type: 'bank',
        used_by_adverts: null,
        used_by_orders: null,
    },
    {
        display_name: 'Other',
        fields: {
            account: {
                display_name: 'Account Number',
                required: 0,
                type: 'text',
                value: 'Account 1',
            },
        },
        id: 'other',
        is_enabled: 1,
        method: 'other',
        type: 'other',
        used_by_adverts: null,
        used_by_orders: null,
    },
] as const;

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/hooks', () => {
    return {
        ...jest.requireActual('@/hooks'),
        api: {
            advertiserPaymentMethods: {
                useCreate: jest.fn(() => ({
                    create: jest.fn(),
                })),
                useUpdate: jest.fn(() => ({
                    update: jest.fn(),
                })),
            },
            paymentMethods: {
                useGet: jest.fn(() => ({
                    data: mockPaymentMethods,
                })),
            },
        },
    };
});

jest.mock('@/hooks/custom-hooks', () => ({
    useModalManager: jest.fn(() => mockModalManager),
    useQueryString: jest.fn().mockReturnValue({ queryString: { tab: '' } }),
}));

const mockUseCreate = api.advertiserPaymentMethods.useCreate as jest.MockedFunction<
    typeof api.advertiserPaymentMethods.useCreate
>;

const mockUseUpdate = api.advertiserPaymentMethods.useUpdate as jest.MockedFunction<
    typeof api.advertiserPaymentMethods.useUpdate
>;

describe('PaymentMethodForm', () => {
    it('should render the component correctly when a selected payment method is not provided', () => {
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        expect(screen.getByText('Payment method')).toBeInTheDocument();
    });
    it('should render the component correctly when a selected payment method is provided', () => {
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        expect(screen.getByDisplayValue('Account 1')).toBeInTheDocument();
    });
    it('should render the component correctly when a selected payment method is passed in with an undefined display name and an undefined value', () => {
        // This test covers the scenario where the display name and value "could be" undefined due to the types returned from the api-types package
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: {
                        fields: {
                            account: {},
                        },
                    },
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        expect(screen.getByText('Choose your payment method')).toBeInTheDocument();
    });
    it('should render the component when the available payment methods are undefined', () => {
        // This test covers the scenario where the available payment methods "could be" undefined because of the types returned from the api-types package
        (api.paymentMethods.useGet as jest.Mock).mockReturnValueOnce({
            data: undefined,
        });
        render(
            <PaymentMethodForm
                formState={{ actionType: 'ADD', title: 'title' }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        expect(screen.getByText('Don’t see your payment method?')).toBeInTheDocument();
    });
    it('should handle the onclick event when the back arrow is clicked and the form is not dirty', async () => {
        const onResetFormState = jest.fn();
        const bankPaymentMethod = mockPaymentMethods.find(method => method.type === 'bank');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: bankPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />
        );
        const inputField = screen.getByDisplayValue('00112233445566778899');
        expect(inputField).toBeInTheDocument();
        const backArrow = screen.getByTestId('dt_page_return_btn');
        await userEvent.click(backArrow);
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should render the close icon when a payment method is selected', () => {
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        expect(screen.getByTestId('dt_payment_methods_form_close_icon')).toBeInTheDocument();
    });
    it('should handle the onclick event when the close icon is clicked', async () => {
        const onAdd = jest.fn();
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={onAdd}
                onResetFormState={jest.fn()}
            />
        );
        const closeIcon = screen.getByTestId('dt_payment_methods_form_close_icon');
        await userEvent.click(closeIcon);
        expect(onAdd).toHaveBeenCalled();
    });
    it('should handle onselect when an item is selected in the dropdown', async () => {
        const onAdd = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={onAdd}
                onResetFormState={jest.fn()}
            />
        );
        const dropdown = screen.getByRole('combobox');

        await userEvent.click(dropdown);

        const dropdownItem = screen.getByText('Bank Transfer');
        await userEvent.click(dropdownItem);
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'bank');
        expect(onAdd).toHaveBeenCalledWith({
            displayName: otherPaymentMethod?.display_name,
            fields: otherPaymentMethod?.fields,
            method: otherPaymentMethod?.method,
        });
    });
    it('should handle onclick when the add new button is clicked', async () => {
        const onAdd = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={onAdd}
                onResetFormState={jest.fn()}
            />
        );
        const addNewButton = screen.getByRole('button', { name: 'Add new.' });
        await userEvent.click(addNewButton);
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        expect(onAdd).toHaveBeenCalledWith({
            displayName: otherPaymentMethod?.display_name,
            fields: otherPaymentMethod?.fields,
            method: otherPaymentMethod?.method,
        });
    });
    it('should reset the form when usecreate returns issuccess set to true', () => {
        (mockUseCreate as jest.Mock).mockReturnValueOnce({
            create: jest.fn(),
            isSuccess: true,
        });
        const onResetFormState = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />
        );
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should reset the form when useupdate returns issuccess set to true', () => {
        (mockUseUpdate as jest.Mock).mockReturnValueOnce({
            isSuccess: true,
            update: jest.fn(),
        });
        const onResetFormState = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={onResetFormState}
            />
        );
        expect(onResetFormState).toHaveBeenCalled();
    });
    it('should handle submit when the form is submitted and the actiontype is add', async () => {
        const create = jest.fn();
        (mockUseCreate as jest.Mock).mockImplementation(() => {
            return {
                create,
            };
        });
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();

        await userEvent.click(inputField);
        await userEvent.type(inputField, 'Account 2');
        await userEvent.tab();
        const submitButton = screen.getByRole('button', { name: 'Add' });
        expect(submitButton).toBeInTheDocument();
        await userEvent.click(submitButton);

        expect(create).toHaveBeenCalled();
    });
    it('should handle submit when the form is submitted and the actiontype is edit', async () => {
        const update = jest.fn();
        (mockUseUpdate as jest.Mock).mockImplementation(() => {
            return {
                update,
            };
        });
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();

        await userEvent.click(inputField);
        await userEvent.type(inputField, 'Account 2');
        await userEvent.tab();
        const submitButton = screen.getByText('Save changes');
        expect(submitButton).toBeInTheDocument();
        await userEvent.click(submitButton);

        expect(update).toHaveBeenCalled();
    });
    it('should handle onclick when the back arrow is clicked and the form is dirty, and close the opened modal when go back button is clicked', async () => {
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        mockModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'PaymentMethodModal');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();

        await userEvent.click(inputField);
        await userEvent.type(inputField, 'Account 2');
        await userEvent.tab();

        const backArrow = screen.getByTestId('dt_page_return_btn');
        expect(backArrow).toBeInTheDocument();
        await userEvent.click(backArrow);
        expect(screen.getByText('Cancel adding this payment method?')).toBeInTheDocument();
        const dontCancelButton = screen.getByRole('button', { name: 'Go back' });
        expect(dontCancelButton).toBeInTheDocument();
        await userEvent.click(dontCancelButton);
        expect(screen.queryByText('Cancel adding this payment method?')).not.toBeInTheDocument();
    });
    it("should handle onclick when the back arrow is clicked and the form is dirty, and close the opened modal when don't cancel button is clicked", async () => {
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        mockModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'PaymentMethodModal');
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();

        await userEvent.click(inputField);
        await userEvent.type(inputField, 'Account 2');
        await userEvent.tab();

        const backArrow = screen.getByTestId('dt_page_return_btn');
        expect(backArrow).toBeInTheDocument();
        await userEvent.click(backArrow);
        expect(screen.getByText('Cancel your edits?')).toBeInTheDocument();
        const dontCancelButton = screen.getByRole('button', { name: "Don't cancel" });
        expect(dontCancelButton).toBeInTheDocument();
        await userEvent.click(dontCancelButton);
        expect(screen.queryByText('Cancel your edits?')).not.toBeInTheDocument();
    });
    it('should call hideModal and onResetFormState when user clicks Cancel button', async () => {
        mockModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'PaymentMethodModal');
        const otherPaymentMethod = mockPaymentMethods.find(method => method.type === 'other');
        const mockOnResetFormState = jest.fn();
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    selectedPaymentMethod: otherPaymentMethod,
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={mockOnResetFormState}
            />
        );
        const inputField = screen.getByDisplayValue('Account 1');
        expect(inputField).toBeInTheDocument();

        await userEvent.click(inputField);
        await userEvent.type(inputField, 'Account 2');
        await userEvent.tab();

        const backArrow = screen.getByTestId('dt_page_return_btn');
        expect(backArrow).toBeInTheDocument();
        await userEvent.click(backArrow);

        const cancelButton = screen.queryAllByRole('button', { name: 'Cancel' })[1];
        expect(cancelButton).toBeInTheDocument();
        await userEvent.click(cancelButton);
        expect(mockModalManager.hideModal).toHaveBeenCalledWith({ shouldHideAllModals: true });
        expect(mockOnResetFormState).toHaveBeenCalled();
    });
    it('should show PaymentMethodErrorModal if error is returned when creating a payment method', () => {
        mockModalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'PaymentMethodErrorModal'
        );
        (mockUseCreate as jest.Mock).mockReturnValueOnce({
            create: jest.fn(),
            error: { message: 'error creating payment method' },
            isError: true,
        });
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );

        expect(mockModalManager.showModal).toHaveBeenCalledWith('PaymentMethodErrorModal');
        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
        expect(screen.getByText('error creating payment method')).toBeInTheDocument();
    });
    it('should call hideModal and reset the form when the Ok button is clicked on the PaymentMethodErrorModal', () => {
        mockModalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'PaymentMethodErrorModal'
        );
        const mockReset = jest.fn();
        (mockUseCreate as jest.Mock).mockReturnValueOnce({
            create: jest.fn(),
            error: { message: 'error creating payment method' },
            isError: true,
            reset: mockReset,
        });

        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'ADD',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );

        const okButton = screen.getByRole('button', { name: 'Ok' });
        expect(okButton).toBeInTheDocument();
        fireEvent.click(okButton);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
        expect(mockReset).toHaveBeenCalled();
    });
    it('should show PaymentMethodErrorModal if error is returned when updating a payment method', () => {
        mockModalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'PaymentMethodErrorModal'
        );
        (mockUseUpdate as jest.Mock).mockReturnValueOnce({
            error: { message: 'error updating payment method' },
            isError: true,
            update: jest.fn(),
        });
        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );

        expect(mockModalManager.showModal).toHaveBeenCalledWith('PaymentMethodErrorModal');
        expect(screen.getByText('Something’s not right')).toBeInTheDocument();
        expect(screen.getByText('error updating payment method')).toBeInTheDocument();
    });
    it('should call hideModal and reset the form when the Ok button is clicked on the PaymentMethodErrorModal', () => {
        mockModalManager.isModalOpenFor.mockImplementation(
            (modalName: string) => modalName === 'PaymentMethodErrorModal'
        );
        const mockReset = jest.fn();
        (mockUseUpdate as jest.Mock).mockReturnValueOnce({
            error: { message: 'error updating payment method' },
            isError: true,
            reset: mockReset,
            update: jest.fn(),
        });

        render(
            <PaymentMethodForm
                formState={{
                    actionType: 'EDIT',
                    title: 'title',
                }}
                onAdd={jest.fn()}
                onResetFormState={jest.fn()}
            />
        );

        const okButton = screen.getByRole('button', { name: 'Ok' });
        expect(okButton).toBeInTheDocument();
        fireEvent.click(okButton);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
        expect(mockReset).toHaveBeenCalled();
    });
});
