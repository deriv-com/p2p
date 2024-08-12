import { TCurrency } from 'types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingRate from '../FloatingRate';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        exchangeRates: {
            useGet: jest.fn(() => ({
                exchangeRate: 1,
            })),
        },
        settings: {
            useSettings: jest.fn(() => ({
                data: {
                    override_exchange_rate: 1,
                },
            })),
        },
    },
}));

const mockProps = {
    changeHandler: jest.fn(),
    errorMessages: '',
    fiatCurrency: 'USD',
    localCurrency: 'IDR' as TCurrency,
    onChange: jest.fn(),
    value: '1.1',
};

describe('FloatingRate', () => {
    it('should render the component as expected', () => {
        render(<FloatingRate {...mockProps} />);
        expect(screen.getByText(/of the market rate/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    it('should handle onChange', async () => {
        render(<FloatingRate {...mockProps} />);
        const input = screen.getByDisplayValue('1.1');
        expect(input).toBeInTheDocument();
        await userEvent.type(input, '1');
        expect(mockProps.changeHandler).toHaveBeenCalledTimes(1);
    });
    it('should show error message', () => {
        render(<FloatingRate {...mockProps} errorMessages='Error' />);
        expect(screen.getByText('Error')).toBeInTheDocument();
    });
    it('should display rate message when no errors are there', () => {
        render(<FloatingRate {...mockProps} />);
        expect(screen.getByText(/Your rate is =/)).toBeInTheDocument();
    });
    it('should handle blur event', async () => {
        render(<FloatingRate {...mockProps} />);
        const input = screen.getByDisplayValue('1.1');
        await userEvent.click(input);
        await userEvent.tab();
        expect(input).toHaveValue('+1.10');
    });
});
