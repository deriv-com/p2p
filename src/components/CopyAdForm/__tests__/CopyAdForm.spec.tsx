// import { ReactNode } from 'react';
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

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

jest.mock('@/pages/my-ads/components/AdFormInput', () => ({
    AdFormInput: () => <div>AdFormInput</div>,
}));

jest.mock('@/pages/my-ads/components/AdFormTextArea', () => ({
    AdFormTextArea: () => <div>AdFormTextArea</div>,
}));

jest.mock('@/hooks/custom-hooks', () => {
    return {
        ...jest.requireActual('@/hooks'),
        useFloatingRate: () => ({ floatRateOffsetLimitString: '22', rateType: 'fixed' }),
    };
});

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        countryList: {
            useGet: jest.fn(() => ({ data: mockCountryList })),
        },
    },
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
});
