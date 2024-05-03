import { TCurrency } from 'types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdConditionsSection from '../AdConditionsSection';

const mockProps = {
    countryList: {},
    currency: 'USD' as TCurrency,
    getCurrentStep: jest.fn(),
    getTotalSteps: jest.fn(),
    goToNextStep: jest.fn(),
    goToPreviousStep: jest.fn(),
    localCurrency: 'USD' as TCurrency,
    rateType: 'fixed',
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockSetValue = jest.fn();
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    useFormContext: jest.fn(() => ({
        formState: { errors: {} },
        getValues: jest.fn(),
        setValue: mockSetValue,
        watch: jest.fn(),
    })),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useQueryString: jest.fn().mockReturnValue({ queryString: { advertId: '' } }),
}));

jest.mock('../../AdSummary', () => ({
    AdSummary: () => <div>AdSummary</div>,
}));

jest.mock('../../PreferredCountriesSelector', () => ({
    PreferredCountriesSelector: () => <div>PreferredCountriesSelector</div>,
}));
describe('AdConditionsSection', () => {
    it('should render the ad conditions section component', () => {
        render(<AdConditionsSection {...mockProps} />);
        expect(screen.getByText('Counterparty conditions (optional)')).toBeInTheDocument();
        expect(screen.getByText('Only users who match these criteria will see your ad.')).toBeInTheDocument();
        expect(screen.getByText('AdSummary')).toBeInTheDocument();
        expect(screen.getByText('PreferredCountriesSelector')).toBeInTheDocument();
    });
    it('should handle clicking on the block selector for joining date', async () => {
        render(<AdConditionsSection {...mockProps} />);
        await userEvent.click(screen.getByText('15 days'));
        expect(mockSetValue).toHaveBeenCalledWith('min-join-days', 15);
    });
    it('should handle clicking on the block selector for completion rate', async () => {
        render(<AdConditionsSection {...mockProps} />);
        await userEvent.click(screen.getByText('90%'));
        expect(mockSetValue).toHaveBeenCalledWith('min-completion-rate', 90);
    });
});
