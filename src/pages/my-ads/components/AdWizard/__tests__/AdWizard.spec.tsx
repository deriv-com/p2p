import { TCurrency } from 'types';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import AdWizard from '../AdWizard';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    FormProgress: () => <div>FormProgress</div>,
}));

jest.mock('../../AdTypeSection', () => ({
    AdTypeSection: () => <div>AdTypeSection</div>,
}));

jest.mock('../../AdProgressBar', () => ({
    AdProgressBar: () => <div>AdProgressBar</div>,
}));

const mockProps = {
    countryList: {},
    currency: 'usd' as TCurrency,
    initialData: {
        minCompletionRate: null,
        minJoinDays: null,
        paymentMethod: [],
        selectedCountries: [],
    },
    localCurrency: 'usd' as TCurrency,
    onCancel: jest.fn(),
    orderExpiryOptions: [900, 1800],
    rateType: 'float',
    setShouldReset: jest.fn(),
    shouldReset: false,
    steps: [{ header: { title: 'step 1' } }, { header: { title: 'step 2' } }, { header: { title: 'step 3' } }],
};

describe('AdWizard', () => {
    it('should render the ad wizard component', () => {
        render(<AdWizard {...mockProps} />);
        expect(screen.getByText('FormProgress')).toBeInTheDocument();
    });
    it('should render the AdProgressBar component in responsive view', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
        });
        render(<AdWizard {...mockProps} />);
        expect(screen.getByText('AdProgressBar')).toBeInTheDocument();
    });
});
