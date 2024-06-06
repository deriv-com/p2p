import { TCurrency } from 'types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdTypeSection from '../AdTypeSection';

jest.mock('../../AdFormTextArea', () => ({
    AdFormTextArea: () => <div>AdFormTextArea</div>,
}));

const mockSetFieldValue = jest.fn();
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
    useFormContext: () => ({
        control: 'mockedControl',
        formState: {
            dirtyFields: { amount: true },
            isDirty: false,
            isValid: true,
        },
        getValues: jest.fn(() => 'mockedValues'),
        setValue: mockSetFieldValue,
        trigger: mockTriggerFunction,
        watch: jest.fn(() => 'buy'),
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useQueryString: jest.fn().mockReturnValue({ queryString: { advertId: '' } }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advertiser: {
            useGetInfo: jest.fn(() => ({
                data: {
                    balance_available: 1000,
                },
            })),
        },
    },
}));

const mockProps = {
    currency: 'usd' as TCurrency,
    getCurrentStep: jest.fn(() => 1),
    getTotalSteps: jest.fn(),
    goToNextStep: jest.fn(),
    goToPreviousStep: jest.fn(),
    localCurrency: 'usd' as TCurrency,
    onCancel: jest.fn(),
    rateType: 'float',
};

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    FloatingRate: () => <div>FloatingRate</div>,
}));

describe('AdTypeSection', () => {
    it('should render the ad type section component', () => {
        render(<AdTypeSection {...mockProps} />);
        expect(screen.getByText('Total amount')).toBeInTheDocument();
        expect(screen.getByText('Min order')).toBeInTheDocument();
        expect(screen.getByText('Max order')).toBeInTheDocument();
        expect(screen.getByText('AdFormTextArea')).toBeInTheDocument();
    });
    it('should handle ad type change', async () => {
        render(<AdTypeSection {...mockProps} />);
        const element = screen.getByRole('radio', { name: /sell/i });
        await userEvent.click(element);
        expect(mockSetFieldValue).toHaveBeenCalledWith('ad-type', 'sell');
    });
    it('should handle Cancel button click', async () => {
        render(<AdTypeSection {...mockProps} />);
        const element = screen.getByRole('button', { name: 'Cancel' });
        await userEvent.click(element);
        expect(mockProps.onCancel).toHaveBeenCalled();
    });
    it('should handle the trigger validation', async () => {
        render(<AdTypeSection {...mockProps} />);
        await userEvent.type(screen.getByPlaceholderText('Max order'), '200');
        const element = screen.getByPlaceholderText('Total amount');
        await userEvent.type(element, '100');
        expect(mockTriggerFunction).toHaveBeenCalled();
    });
});
