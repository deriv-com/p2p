import { FC, PropsWithChildren } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyDropdown from '../CurrencyDropdown';

const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <div>
        <div>Click me</div>
        {children}
    </div>
);

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        settings: {
            useGetSettings: () => ({
                data: {
                    currency_list: [
                        {
                            display_name: 'BOB',
                            has_adverts: 1,
                            is_default: undefined,
                            text: 'Boliviano',
                            value: 'BOB',
                        },
                        {
                            display_name: 'IDR',
                            has_adverts: 1,
                            is_default: 1,
                            text: 'Indonesian Rupiah',
                            value: 'IDR',
                        },
                    ],
                },
            }),
        },
    },
}));

let mockIsMobile = false;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: mockIsMobile })),
}));
const mockProps = {
    selectedCurrency: 'IDR',
    setSelectedCurrency: jest.fn(),
};

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('<CurrencyDropdown />', () => {
    it('should call setSelectedCurrency when a currency is selected from the dropdown', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await userEvent.click(currencyDropdown);

        const bobOption = screen.getByText('BOB');
        await userEvent.click(bobOption);

        expect(mockProps.setSelectedCurrency).toHaveBeenCalledWith('BOB');
    });

    it('should hide the list if the user clicks outside the dropdown', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await userEvent.click(currencyDropdown);

        const clickMe = screen.getByText('Click me');
        await userEvent.click(clickMe);

        expect(screen.queryByText('BOB')).not.toBeInTheDocument();
    });

    it('should show Preferred currency text and hide list if user clicks on arrow icon when isMobile is true', async () => {
        mockIsMobile = true;
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await userEvent.click(currencyDropdown);

        expect(screen.getByText('Preferred currency')).toBeInTheDocument();

        const arrowIcon = screen.getByTestId('dt_mobile_wrapper_button');
        await userEvent.click(arrowIcon);

        expect(screen.queryByText('Preferred currency')).not.toBeInTheDocument();
    });

    it('should only show BOB in the currency list if BOB is searched', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await userEvent.click(currencyDropdown);

        const searchInput = screen.getByRole('searchbox');

        async () => {
            await userEvent.type(searchInput, 'BOB');
        };

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByText('BOB')).toBeInTheDocument();
        expect(screen.queryByText('IDR')).not.toBeInTheDocument();
    });

    it('should show No results for message if currency is not in the list', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await userEvent.click(currencyDropdown);

        const searchInput = screen.getByRole('searchbox');

        async () => {
            await userEvent.type(searchInput, 'JPY');
        };

        act(() => {
            jest.runAllTimers();
        });

        expect(screen.getByText(/No results for "JPY"./s)).toBeInTheDocument();

        async () => {
            await userEvent.clear(searchInput);
        };

        act(() => {
            jest.runAllTimers();
        });
    });
});
