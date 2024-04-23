import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from '../InputField';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    isError: false,
    name: 'test',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    type: 'number',
    value: 0,
};
describe('InputField', () => {
    it('should render the component as expected', () => {
        render(<InputField {...mockProps} />);
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });
    it('should handle onChange', async () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        expect(input).toBeInTheDocument();
        await userEvent.type(input, '1');
        expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    });
    it('should handle increment change on plus button click', async () => {
        render(<InputField {...mockProps} />);
        const plusButton = screen.getByTestId('dt_input_field_increment');
        await userEvent.click(plusButton);
        expect(mockProps.onChange).toHaveBeenCalled();
    });
    it('should handle decrement change on minus button click', async () => {
        render(<InputField {...mockProps} />);
        const minusButton = screen.getByTestId('dt_input_field_decrement');
        await userEvent.click(minusButton);
        expect(mockProps.onChange).toHaveBeenCalled();
    });
    it('should handle onBlur', async () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        await userEvent.click(input);
        await userEvent.tab();
        expect(mockProps.onBlur).toHaveBeenCalled();
    });
    it('should handle keyboard button press for increment', async () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        await userEvent.type(input, '{ArrowUp}');
        expect(mockProps.onChange).toHaveBeenCalled();
    });
    it('should handle keyboard button press for decrement', async () => {
        render(<InputField {...mockProps} />);
        const input = screen.getByDisplayValue('0');
        await userEvent.type(input, '{ArrowDown}');
        expect(mockProps.onChange).toHaveBeenCalled();
    });
});
