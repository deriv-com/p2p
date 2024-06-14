import { useIsAdvertiserBarred } from '@/hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PopoverDropdown from '../PopoverDropdown';

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    dropdownList: [
        {
            label: 'label 1',
            value: 'value 1',
        },
        {
            label: 'label 2',
            value: 'value 2',
        },
    ],
    onClick: jest.fn(),
    tooltipMessage: 'test tooltip message',
};

const mockUseIsAdvertiserBarred = useIsAdvertiserBarred as jest.MockedFunction<typeof useIsAdvertiserBarred>;

describe('PopoverDropdown', () => {
    it('should render', () => {
        render(<PopoverDropdown {...mockProps} />);
        expect(screen.getByTestId('dt_popover_dropdown_icon')).toBeInTheDocument();
    });
    it('should render the dropdown list on clicking on the icon', async () => {
        render(<PopoverDropdown {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_popover_dropdown_icon'));
        expect(screen.getByText('label 1')).toBeInTheDocument();
    });
    it('should call onClick when item is clicked', async () => {
        render(<PopoverDropdown {...mockProps} />);
        await userEvent.click(screen.getByTestId('dt_popover_dropdown_icon'));
        await userEvent.click(screen.getByText('label 1'));
        expect(mockProps.onClick).toHaveBeenCalledWith('value 1');
    });

    it('should disable the icon if advertiser is barred', async () => {
        mockUseIsAdvertiserBarred.mockReturnValue(true);
        render(<PopoverDropdown {...mockProps} />);
        expect(screen.getByTestId('dt_popover_dropdown_icon')).not.toHaveProperty('onClick');
    });
});
