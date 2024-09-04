import { mockBusinessHours } from '@/__mocks__/mock-data';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BusinessHoursModal from '../BusinessHoursModal';

const mockProps = {
    hideModal: jest.fn(),
    isModalOpen: true,
};

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

const mockUseUpdate = {
    isSuccess: true,
    mutate: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
        isMobile: false,
    }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advertiser: {
            useUpdate: jest.fn(() => mockUseUpdate),
        },
        settings: {
            useSettings: jest.fn().mockReturnValue({
                data: {
                    business_hours_minutes_interval: 15,
                },
            }),
        },
    },
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useGetBusinessHours: jest.fn(() => ({
        businessHours: mockBusinessHours,
    })),
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('@/components/Modals', () => ({
    BusinessHoursModal: () => <div>BusinessHoursModal</div>,
}));

const user = userEvent.setup({ delay: null });
const mockUseDevice = useDevice as jest.Mock;

describe('<BusinessHoursModal />', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render the main page', () => {
        render(<BusinessHoursModal {...mockProps} />);

        expect(screen.getByText('Business hours')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Choose when you’re available to accept orders. Your ads will only be visible during these times.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('* You can only place orders on other ads during your set business hours.')
        ).toBeInTheDocument();
        expect(
            screen.getByText('* Some ads may have a delay before becoming visible to potential buyers.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit business hours' })).toBeInTheDocument();
    });

    it('should show the edit page when Edit business hours is clicked', async () => {
        render(<BusinessHoursModal {...mockProps} />);

        await user.click(screen.getByRole('button', { name: 'Edit business hours' }));

        const saveButton = screen.getByRole('button', { name: 'Save' });

        expect(screen.getByText('Edit business hours')).toBeInTheDocument();
        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

        // screen.debug(undefined, 1000000);
    });

    it('should change the business hours when a change is made', async () => {
        render(<BusinessHoursModal {...mockProps} />);

        await user.click(screen.getByRole('button', { name: 'Edit business hours' }));

        const mondayOpen24Hours = screen.queryAllByRole('button', { name: 'Open 24 hours' })[1];
        await user.click(mondayOpen24Hours);

        const startTimeComboBox = screen.queryAllByRole('combobox')[0];
        await user.click(startTimeComboBox);
        const startTimeOption = screen.getByRole('option', { name: '12:15 am' });
        await user.click(startTimeOption);

        const endTimeComboBox = screen.queryAllByRole('combobox')[1];
        await user.click(endTimeComboBox);
        const endTimeOption = screen.getByRole('option', { name: '1:00 am' });
        await user.click(endTimeOption);

        const saveButton = screen.getByRole('button', { name: 'Save' });
        expect(saveButton).toBeEnabled();
        await user.click(saveButton);

        expect(mockUseUpdate.mutate).toHaveBeenCalled();
    });

    it('should reset the dropdown values when Reset icon is clicked', async () => {
        render(<BusinessHoursModal {...mockProps} />);

        await user.click(screen.getByRole('button', { name: 'Edit business hours' }));

        const mondayOpen24Hours = screen.queryAllByRole('button', { name: 'Open 24 hours' })[1];
        await user.click(mondayOpen24Hours);

        const endTimeComboBox = screen.queryAllByRole('combobox')[1];
        await user.click(endTimeComboBox);
        const endTimeOption = screen.getByRole('option', { name: '1:00 am' });
        await user.click(endTimeOption);

        expect(mondayOpen24Hours).not.toBeInTheDocument();

        const resetIcon = screen.getByTestId('dt_reset_icon_monday');
        await user.click(resetIcon);

        expect(endTimeComboBox).not.toBeInTheDocument();
    });

    it('should disabled the Open 24 hours dropdown if user deselects a day', async () => {
        render(<BusinessHoursModal {...mockProps} />);

        await user.click(screen.getByRole('button', { name: 'Edit business hours' }));
        const saveButton = screen.getByRole('button', { name: 'Save' });

        expect(saveButton).toBeDisabled();

        await user.click(screen.getByRole('button', { name: 'M' }));

        expect(saveButton).toBeEnabled();
    });

    it('should go back to main page when user clicks on Cancel button if there are no changes', async () => {
        render(<BusinessHoursModal {...mockProps} />);

        await user.click(screen.getByRole('button', { name: 'Edit business hours' }));

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(screen.getByText('Business hours')).toBeInTheDocument();
    });

    it('should show CancelBusinessHoursModal when user clicks on Cancel button if there are changes', async () => {
        render(<BusinessHoursModal {...mockProps} />);

        await user.click(screen.getByRole('button', { name: 'Edit business hours' }));

        const mondayOpen24Hours = screen.queryAllByRole('button', { name: 'Open 24 hours' })[1];
        await user.click(mondayOpen24Hours);
        const endTimeComboBox = screen.queryAllByRole('combobox')[1];

        await user.click(endTimeComboBox);
        const endTimeOption = screen.getByRole('option', { name: '1:00 am' });
        await user.click(endTimeOption);

        await user.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(mockModalManager.showModal).toHaveBeenCalledWith('CancelBusinessHoursModal');
    });

    it('should call hideModal if user clicks on Discard button in CancelBusinessHoursModal', async () => {
        mockModalManager.isModalOpenFor.mockReturnValue(true);
        render(<BusinessHoursModal {...mockProps} />);

        const discardButton = screen.getByRole('button', { name: 'Discard' });

        expect(screen.getByText('Discard changes?')).toBeInTheDocument();
        expect(discardButton).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();

        await user.click(discardButton);

        expect(mockModalManager.hideModal).toHaveBeenCalled();
    });

    it('should call hideModal with shouldHideAllModals when user clicks on close icon', async () => {
        mockModalManager.isModalOpenFor.mockReturnValue(false);
        const { rerender } = render(<BusinessHoursModal {...mockProps} />);

        const closeIcon = screen.getByTestId('dt-close-icon');

        await user.click(closeIcon);

        rerender(<BusinessHoursModal {...mockProps} />);

        expect(mockProps.hideModal).toHaveBeenCalledWith({ shouldHideAllModals: true });
    });

    it('should render BusinessHoursModal in responsive', () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
        });
        render(<BusinessHoursModal {...mockProps} />);

        expect(screen.getByText('Business hours')).toBeInTheDocument();
        expect(screen.getByTestId('dt_full_page_mobile_wrapper')).toBeInTheDocument();
    });
});
