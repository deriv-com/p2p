import { useLocation } from 'react-router-dom';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
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
    TemporarilyBarredHint: () => <div>TemporarilyBarredHint</div>,
    Verification: () => <div>Verification</div>,
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
}));

jest.mock('../../BuySellTable/BuySellTable', () => jest.fn(() => <div>BuySellTable</div>));

const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;
const mockUseIsAdvertiserBarred = useIsAdvertiserBarred as jest.MockedFunction<typeof useIsAdvertiserBarred>;

describe('<BuySell />', () => {
    it('should render the BuySell Component', () => {
        render(<BuySell />);

        expect(screen.getByText('BuySellTable')).toBeInTheDocument();
        expect(screen.queryByText('TemporarilyBarredHint')).not.toBeInTheDocument();
    });

    it('should render the TemporarilyBarredHint component if isAdvertiserBarred is true', () => {
        mockUseIsAdvertiserBarred.mockReturnValue(true);

        render(<BuySell />);

        expect(screen.getByText('TemporarilyBarredHint')).toBeInTheDocument();
        expect(screen.getByText('BuySellTable')).toBeInTheDocument();
    });

    it('should render the PageReturn and Verification components if poi_poa_verified search param is false', () => {
        (mockUseLocation as jest.Mock).mockImplementation(() => ({
            search: '?poi_poa_verified=false',
        }));

        render(<BuySell />);

        expect(screen.getByTestId('dt_page_return_btn')).toBeInTheDocument();
        expect(screen.queryAllByText('Verification')).toHaveLength(2);
    });

    it('should call history.replace when PageReturn is clicked', async () => {
        (mockUseLocation as jest.Mock).mockImplementation(() => ({
            search: '?poi_poa_verified=false',
        }));

        render(<BuySell />);

        await userEvent.click(screen.getByTestId('dt_page_return_btn'));

        expect(mockReplace).toHaveBeenCalledWith({ pathname: '/buy-sell', search: '' });
    });
});
