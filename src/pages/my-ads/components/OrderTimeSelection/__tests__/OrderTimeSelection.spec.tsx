import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTimeSelection from '../OrderTimeSelection';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isDesktop: true }),
}));

const mockUseDevice = useDevice as jest.Mock;

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({ defaultValue, render }: { defaultValue: object; render: (param: object) => void }) =>
        render({
            field: { onChange: jest.fn(), value: defaultValue },
            fieldState: { error: null },
        }),
    useFormContext: () => ({
        control: 'mockedControl',
        getValues: jest.fn(),
        setValue: jest.fn(),
    }),
}));

const mockProps = { orderExpiryOptions: [900, 1800, 3600] };
describe('OrderTimeSelection', () => {
    it('should render the order time selection component', () => {
        render(<OrderTimeSelection {...mockProps} />);
        expect(screen.getByText('Orders must be completed in')).toBeInTheDocument();
    });
    it('should handle the dropdown click', async () => {
        render(<OrderTimeSelection {...mockProps} />);
        await userEvent.click(screen.getByRole('combobox'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getByText('1 hour')).toBeInTheDocument();
    });
    it('should not do anything on clicking info icon in desktop view', async () => {
        render(<OrderTimeSelection {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_order_info_icon'));
        expect(screen.queryByRole('button', { name: 'Ok' })).not.toBeInTheDocument();
    });
    it('should handle the modal open in mobile view', async () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<OrderTimeSelection {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_order_info_icon'));
        const okButton = screen.getByRole('button', { name: 'Ok' });
        expect(okButton).toBeInTheDocument();
        await userEvent.click(okButton);
        expect(screen.queryByRole('button', { name: 'Ok' })).not.toBeInTheDocument();
    });
});
