import { mockAdvertiserAdvertValues, mockCountryList } from '@/__mocks__/mock-data';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyAdForm from '../CopyAdForm';

const mockProps = {
    ...mockAdvertiserAdvertValues,
    formValues: {
        amount: 22,
        maxOrder: '22',
        minOrder: '22',
        rateValue: '22',
    },
    isModalOpen: true,
    isValid: true,
    onClickCancel: jest.fn(),
    onFormSubmit: jest.fn(),
    onRequestClose: jest.fn(),
};

const mockTriggerFunction = jest.fn();
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({
        control,
        defaultValue,
        name,
        render,
    }: {
        control: string;
        defaultValue: object;
        name: string;
        render: (param: object) => void;
    }) =>
        render({
            field: { control, name, onBlur: jest.fn(), onChange: jest.fn(), value: defaultValue },
            fieldState: { error: null },
        }),
    useForm: () => ({
        control: 'mockedControl',
        formState: {
            dirtyFields: { amount: true },
            isDirty: false,
            isValid: true,
        },
        getValues: jest.fn(() => 'mockedValues'),
        handleSubmit: jest.fn(),
        trigger: mockTriggerFunction,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/hooks/custom-hooks', () => {
    return {
        ...jest.requireActual('@/hooks'),
        useFloatingRate: () => ({ floatRateOffsetLimitString: '22', rateType: 'fixed' }),
    };
});

jest.mock('@deriv-com/api-hooks', () => ({
    ...jest.requireActual('@deriv-com/api-hooks'),
    useP2PCountryList: jest.fn(() => ({
        data: mockCountryList,
    })),
}));

describe('CopyAdForm', () => {
    it('should render the form', () => {
        render(<CopyAdForm {...mockProps} />);
        expect(screen.getByText('Ad type')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(
            screen.getByText('Review your settings and create a new ad. Every ad must have unique limits and rates.')
        ).toBeInTheDocument();
    });
    it('should handle cancel', async () => {
        render(<CopyAdForm {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(button);
        expect(mockProps.onClickCancel).toHaveBeenCalled();
    });
    it('should handle submit', async () => {
        render(<CopyAdForm {...mockProps} />);
        const button = screen.getByRole('button', { name: 'Create ad' });
        await userEvent.click(button);
        expect(mockProps.onFormSubmit).toHaveBeenCalled();
    });
    it('should handle the trigger validation', async () => {
        render(<CopyAdForm {...mockProps} />);
        await userEvent.type(screen.getByPlaceholderText('Max order'), '200');
        const element = screen.getByPlaceholderText('Total amount');
        await userEvent.type(element, '100');
        expect(mockTriggerFunction).toHaveBeenCalled();
    });
});
