import { FC, PropsWithChildren } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyDropdown from '../CurrencyDropdown';

const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <div>
        <div>Click me</div>
        {children}
    </div>
);

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        settings: {
            useSettings: () => ({
                data: {
                    currencyList: [
                        {
                            display_name: 'BOB',
                            has_adverts: 1,
                            is_default: undefined,
                            text: 'Boliviano',
                            value: 'BOB',
                        },
                        {
                            display_name: 'EGP',
                            has_adverts: 1,
                            is_default: 1,
                            text: 'Egyptian Pound',
                            value: 'EGP',
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

let mockIsDesktop = true;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: mockIsDesktop })),
}));
const mockProps = {
    selectedCurrency: 'IDR',
    setSelectedCurrency: jest.fn(),
};

const user = userEvent.setup({ delay: null });

describe('<CurrencyDropdown />', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });
    it('should call setSelectedCurrency when a currency is selected from the dropdown', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await user.click(currencyDropdown);

        const bobOption = screen.getByText('BOB');
        await user.click(bobOption);

        expect(mockProps.setSelectedCurrency).toHaveBeenCalledWith('BOB');
    });

    it('should hide the list if the user clicks outside the dropdown', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await user.click(currencyDropdown);

        const clickMe = screen.getByText('Click me');
        await user.click(clickMe);

        expect(screen.queryByText('BOB')).not.toBeInTheDocument();
    });

    it('should show Preferred currency text and hide list if user clicks on arrow icon when isMobile is true', async () => {
        mockIsDesktop = false;
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await user.click(currencyDropdown);

        expect(screen.getByText('Preferred currency')).toBeInTheDocument();

        const arrowIcon = screen.getByTestId('dt_mobile_wrapper_button');
        await user.click(arrowIcon);

        expect(screen.queryByText('Preferred currency')).not.toBeInTheDocument();
    });

    it('should only show BOB in the currency list if BOB is searched', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await user.click(currencyDropdown);

        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'BOB');

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            Promise.all([
                expect(screen.getByText('Boliviano')).toBeInTheDocument(),
                expect(screen.queryByText('Indonesian Rupiah')).not.toBeInTheDocument(),
                expect(screen.queryByText('Egyptian Pound')).not.toBeInTheDocument(),
            ]);
        });
    });

    it('should show No results for message if currency is not in the list', async () => {
        render(<CurrencyDropdown {...mockProps} />, { wrapper });

        const currencyDropdown = screen.getByText('IDR');
        await user.click(currencyDropdown);

        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'JPY');

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.getByText(/No results for "JPY"./s)).toBeInTheDocument();
        });

        await user.clear(searchInput);

        act(() => {
            jest.runAllTimers();
        });
    });
});
