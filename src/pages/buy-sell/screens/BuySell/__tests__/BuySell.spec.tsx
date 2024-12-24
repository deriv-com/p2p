import { useLocation } from 'react-router-dom';
import { useGetBusinessHours, useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuySell from '../BuySell';

const mockReplace = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        replace: mockReplace,
    })),
    useLocation: jest.fn(() => ({
        search: '',
    })),
}));

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    OutsideBusinessHoursHint: () => <div>OutsideBusinessHoursHint</div>,
    TemporarilyBarredHint: () => <div>TemporarilyBarredHint</div>,
    Verification: () => <div>Verification</div>,
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useGetBusinessHours: jest.fn().mockReturnValue({
        isScheduleAvailable: true,
    }),
    useIsAdvertiser: jest.fn().mockReturnValue(true),
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
}));

jest.mock('../../BuySellTable/BuySellTable', () => jest.fn(() => <div>BuySellTable</div>));

const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;
const mockUseIsAdvertiserBarred = useIsAdvertiserBarred as jest.MockedFunction<typeof useIsAdvertiserBarred>;
const mockUseGetBusinessHours = useGetBusinessHours as jest.Mock;

describe('<BuySell />', () => {
    it('should render the BuySell Component', () => {
        render(<BuySell />);

        expect(screen.getByText('BuySellTable')).toBeInTheDocument();
        expect(screen.queryByText('TemporarilyBarredHint')).not.toBeInTheDocument();
        expect(screen.queryByText('OutsideBusinessHoursHint')).not.toBeInTheDocument();
    });

    it('should render the TemporarilyBarredHint component if isAdvertiserBarred is true', () => {
        mockUseIsAdvertiserBarred.mockReturnValue(true);

        render(<BuySell />);

        expect(screen.queryByText('OutsideBusinessHoursHint')).not.toBeInTheDocument();
        expect(screen.getByText('TemporarilyBarredHint')).toBeInTheDocument();
        expect(screen.getByText('BuySellTable')).toBeInTheDocument();
    });

    it('should render the OutsideBusinessHoursHint component if isScheduleAvailable is false', () => {
        mockUseIsAdvertiserBarred.mockReturnValue(false);
        mockUseGetBusinessHours.mockReturnValue({
            isScheduleAvailable: false,
        });

        render(<BuySell />);

        expect(screen.getByText('OutsideBusinessHoursHint')).toBeInTheDocument();
        expect(screen.queryByText('TemporarilyBarredHint')).not.toBeInTheDocument();
        expect(screen.getByText('BuySellTable')).toBeInTheDocument();
    });

    it('should render the PageReturn and Verification components if verified search param is false', () => {
        (mockUseLocation as jest.Mock).mockImplementation(() => ({
            search: '?verified=false',
        }));

        render(<BuySell />);

        expect(screen.getByTestId('dt_page_return_btn')).toBeInTheDocument();
        expect(screen.queryAllByText('Verification')).toHaveLength(2);
    });

    it('should call history.replace when PageReturn is clicked', async () => {
        (mockUseLocation as jest.Mock).mockImplementation(() => ({
            search: '?verified=false',
        }));

        render(<BuySell />);

        await userEvent.click(screen.getByTestId('dt_page_return_btn'));

        expect(mockReplace).toHaveBeenCalledWith({ pathname: '/buy-sell', search: '' });
    });
});
