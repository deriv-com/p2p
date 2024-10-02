import { useGetBusinessHours } from '@/hooks/custom-hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BusinessHoursTooltip from '../BusinessHoursTooltip';

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(true),
    showModal: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useGetBusinessHours: jest.fn().mockReturnValue({
        isScheduleAvailable: true,
    }),
    useModalManager: jest.fn(() => mockModalManager),
}));

jest.mock('@/components/Modals', () => ({
    BusinessHoursModal: () => <div>BusinessHoursModal</div>,
}));

const mockUseGetBusinessHours = useGetBusinessHours as jest.Mock;

describe('<BusinessHoursTooltip />', () => {
    it('should render Open text when business hours are available', () => {
        render(<BusinessHoursTooltip />);

        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('should render Closed text when business hours are not available', () => {
        mockUseGetBusinessHours.mockReturnValue({
            isScheduleAvailable: false,
        });

        render(<BusinessHoursTooltip />);

        expect(screen.getByText('Closed')).toBeInTheDocument();
    });

    it('should call showModal when user clicks on text', async () => {
        render(<BusinessHoursTooltip />);

        await userEvent.click(screen.getByText('Closed'));

        expect(mockModalManager.showModal).toHaveBeenCalledWith('BusinessHoursModal');
    });
});
