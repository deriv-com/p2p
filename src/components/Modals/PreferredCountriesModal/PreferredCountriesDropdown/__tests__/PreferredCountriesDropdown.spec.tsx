import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreferredCountriesDropdown from '../PreferredCountriesDropdown';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    list: [
        {
            text: 'United Kingdom',
            value: 'uk',
        },
        {
            text: 'United States',
            value: 'us',
        },
    ],
    selectedCountries: ['uk'],
    setSelectedCountries: jest.fn(),
    setShouldDisplayFooter: jest.fn(),
};

const user = userEvent.setup({ delay: null });

describe('PreferredCountriesDropdown', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });
    it('should render the component as expected', () => {
        render(<PreferredCountriesDropdown {...mockProps} />);
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('All countries')).toBeInTheDocument();
    });
    it('should handle selecting all countries checkbox for selecting all countries', async () => {
        render(<PreferredCountriesDropdown {...mockProps} />);
        const allCountriesCheckbox = screen.getByRole('checkbox', { name: 'All countries' });
        await user.click(allCountriesCheckbox);
        expect(mockProps.setSelectedCountries).toHaveBeenCalledWith(['uk', 'us']);
    });
    it('should handle unselecting all countries checkbox for unselecting all countries', async () => {
        render(<PreferredCountriesDropdown {...mockProps} selectedCountries={['uk', 'us']} />);
        const allCountriesCheckbox = screen.getByRole('checkbox', { name: 'All countries' });
        await user.click(allCountriesCheckbox);
        expect(mockProps.setSelectedCountries).toHaveBeenCalledWith([]);
    });
    it('should handle selecting of individual country', async () => {
        render(<PreferredCountriesDropdown {...mockProps} />);
        const usCheckbox = screen.getByRole('checkbox', { name: 'United States' });
        await user.click(usCheckbox);
        expect(mockProps.setSelectedCountries).toHaveBeenCalledWith(['uk', 'us']);
    });
    it('should handle unselecting of individual country', async () => {
        render(<PreferredCountriesDropdown {...mockProps} selectedCountries={['uk', 'us']} />);
        const ukCheckbox = screen.getByRole('checkbox', { name: 'United Kingdom' });
        await user.click(ukCheckbox);
        expect(mockProps.setSelectedCountries).toHaveBeenCalledWith(['us']);
    });
    it('should display no search results message when there are no search results', async () => {
        render(<PreferredCountriesDropdown {...mockProps} />);
        const searchInput = screen.getByRole('searchbox');

        await user.type(searchInput, 'India');
        act(() => {
            jest.runAllTimers();
        });
        expect(screen.getByText('No results for “India”.')).toBeInTheDocument();
    });
    it('should display full list on search clear', async () => {
        render(<PreferredCountriesDropdown {...mockProps} />);
        const searchInput = screen.getByPlaceholderText('Search countries');

        await user.type(searchInput, 'India');

        act(() => {
            jest.runAllTimers();
        });

        await user.clear(searchInput);

        act(() => {
            jest.runAllTimers();
        });
        expect(screen.getByText('United Kingdom')).toBeInTheDocument();
        expect(screen.getByText('United States')).toBeInTheDocument();
    });
});
