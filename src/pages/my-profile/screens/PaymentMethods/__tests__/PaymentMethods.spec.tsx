import { ComponentProps, useReducer } from 'react';
import { PaymentMethodForm } from '@/components';
import { api } from '@/hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentMethods from '../PaymentMethods';
import { PaymentMethodsList } from '../PaymentMethodsList';

const data: ReturnType<typeof api.advertiserPaymentMethods.useGet>['data'] = [
    {
        display_name: 'Other',
        fields: {
            account: {
                display_name: 'Account 1',
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
];

const mockUseGetResponse = {
    context: null,
    data: undefined,
    error: null,
    failureCount: 0,
    failureReason: null,
    get: jest.fn(),
    isError: false,
    isIdle: false,
    isPaused: false,
    isPending: false,
    isSuccess: false,
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    reset: () => undefined,
    status: 'pending',
    submittedAt: 123,
    variables: {},
};

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useReducer: jest.fn().mockReturnValue([]),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: () => <div>Loader</div>,
}));

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    PaymentMethodForm: jest.fn(({ onResetFormState }: ComponentProps<typeof PaymentMethodForm>) => (
        <div>
            <span>PaymentMethodForm</span>
            <button data-testid='dt_cancel_button' onClick={onResetFormState}>
                Cancel
            </button>
        </div>
    )),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advertiserPaymentMethods: {
            useGet: jest.fn(),
        },
    },
}));

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useIsAdvertiser: jest.fn(() => true),
}));

jest.mock('../PaymentMethodsEmpty', () => ({
    PaymentMethodsEmpty: jest.fn(() => <div>PaymentMethodsEmpty</div>),
}));

jest.mock('../PaymentMethodsList', () => ({
    PaymentMethodsList: jest.fn(({ onAdd, onDelete, onEdit }: ComponentProps<typeof PaymentMethodsList>) => (
        <div>
            <span>PaymentMethodsList</span>
            <button onClick={() => onAdd()}>Add</button>
            <button onClick={() => onEdit(data[0])}>Edit</button>
            <button onClick={() => onDelete(data[0])}>Delete</button>
        </div>
    )),
}));

const mockUseGet = api.advertiserPaymentMethods.useGet as jest.MockedFunction<
    typeof api.advertiserPaymentMethods.useGet
>;
const mockUseReducer = useReducer as jest.MockedFunction<typeof useReducer>;

describe('PaymentMethods', () => {
    it('should call dispatch with the type add', async () => {
        const mockDispatch = jest.fn();
        mockUseReducer.mockReturnValue([{ isVisible: false }, mockDispatch]);
        (mockUseGet as jest.Mock).mockReturnValue({ ...mockUseGetResponse, data });
        render(<PaymentMethods />);
        await userEvent.click(screen.getByText('Add'));
        expect(mockDispatch).toHaveBeenCalledWith({
            payload: {
                selectedPaymentMethod: undefined,
            },
            type: 'ADD',
        });
    });
    it('should call dispatch with the type edit', async () => {
        const mockDispatch = jest.fn();
        mockUseReducer.mockReturnValue([{ isVisible: false }, mockDispatch]);
        (mockUseGet as jest.Mock).mockReturnValue({ ...mockUseGetResponse, data });
        render(<PaymentMethods />);
        await userEvent.click(screen.getByText('Edit'));
        expect(mockDispatch).toHaveBeenCalledWith({ payload: { selectedPaymentMethod: data[0] }, type: 'EDIT' });
    });
    it('should call dispatch with type delete', async () => {
        const mockDispatch = jest.fn();
        mockUseReducer.mockReturnValue([{ isVisible: false }, mockDispatch]);
        (mockUseGet as jest.Mock).mockReturnValue({ ...mockUseGetResponse, data });
        render(<PaymentMethods />);
        await userEvent.click(screen.getByText('Delete'));
        expect(mockDispatch).toHaveBeenCalledWith({ payload: { selectedPaymentMethod: data[0] }, type: 'DELETE' });
    });
    it('should call dispatch with type reset', async () => {
        const mockDispatch = jest.fn();
        mockUseReducer.mockReturnValue([{ isVisible: true }, mockDispatch]);
        render(<PaymentMethods />);
        await userEvent.click(screen.getByTestId('dt_cancel_button'));
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET' });
    });
    it('should show the loader when isPending is true', () => {
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGetResponse,
            isPending: true,
            isSuccess: false,
            status: 'pending',
        });
        render(<PaymentMethods />);
        expect(screen.getByText('Loader')).toBeInTheDocument();
    });
    it('should render the payment methods empty component when data undefined and formstate.isvisible is false', () => {
        mockUseReducer.mockReturnValue([{ isVisible: false }, jest.fn()]);
        (mockUseGet as jest.Mock).mockReturnValue({ ...mockUseGetResponse, data: undefined });
        render(<PaymentMethods />);
        expect(screen.getByText('PaymentMethodsEmpty')).toBeInTheDocument();
    });
    it('should render the payment method form when the formstate. isvisible is true', () => {
        mockUseReducer.mockReturnValue([{ isVisible: true }, jest.fn()]);
        render(<PaymentMethods />);
        expect(screen.getByText('PaymentMethodForm')).toBeInTheDocument();
    });
    it('should render payment methods list when data is defined and formstate.isvisible is false', () => {
        mockUseReducer.mockReturnValue([{ isVisible: false }, jest.fn()]);
        (mockUseGet as jest.Mock).mockReturnValue({
            ...mockUseGetResponse,
            data: [
                {
                    display_name: 'Other',
                    fields: {
                        account: {
                            display_name: 'Account 1',
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
            ],
        });
        render(<PaymentMethods />);
        expect(screen.getByText('PaymentMethodsList')).toBeInTheDocument();
    });
});
