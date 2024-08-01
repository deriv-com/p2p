import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileCounterparties from '../MyProfileCounterparties';

jest.mock('../../MyProfileCounterparties/MyProfileCounterpartiesHeader', () => ({
    MyProfileCounterpartiesHeader: () => <div>MyProfileCounterpartiesHeader</div>,
}));

jest.mock('../../MyProfileCounterparties/MyProfileCounterpartiesTable', () => ({
    MyProfileCounterpartiesTable: () => <div>MyProfileCounterpartiesTable</div>,
}));

jest.mock('@/components/Modals/RadioGroupFilterModal', () => ({
    RadioGroupFilterModal: jest.fn(() => <div>RadioGroupFilterModal</div>),
}));

const mockSetQueryString = jest.fn();

jest.mock('@/hooks/custom-hooks', () => ({
    useQueryString: jest.fn(() => ({
        setQueryString: mockSetQueryString,
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

describe('MyProfileCounterparties', () => {
    it('should render the component as expected', () => {
        render(<MyProfileCounterparties />);
        expect(screen.getByText('MyProfileCounterpartiesTable')).toBeInTheDocument();
    });
    it('should render the mobile view as expected', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<MyProfileCounterparties />);
        expect(screen.getByText('My counterparties')).toBeInTheDocument();
        expect(screen.getByText('MyProfileCounterpartiesTable')).toBeInTheDocument();
    });
    it('should call setQueryString if back button is clicked', async () => {
        render(<MyProfileCounterparties />);

        const backButton = screen.getByTestId('dt_mobile_wrapper_button');
        await userEvent.click(backButton);

        expect(mockSetQueryString).toHaveBeenCalledWith({ tab: 'default' });
    });
});
