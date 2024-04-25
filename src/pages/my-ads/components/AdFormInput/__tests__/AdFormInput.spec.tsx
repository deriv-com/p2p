import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdFormInput from '../AdFormInput';

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
        getValues: jest.fn(),
    }),
}));

const mockProps = {
    currency: 'usd',
    label: 'label',
    name: 'name',
    rightPlaceholder: '',
    triggerValidationFunction: jest.fn(),
};

describe('AdFormInput', () => {
    it('should render the form input component', () => {
        render(<AdFormInput {...mockProps} />);
        expect(screen.getByText('label')).toBeInTheDocument();
    });
    it('should handle the input change', async () => {
        render(<AdFormInput {...mockProps} />);
        const input = screen.getByPlaceholderText('label');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('');
        await userEvent.type(input, 'test');
        expect(mockProps.triggerValidationFunction).toHaveBeenCalled();
        expect(input).toHaveValue('test');
    });
});
