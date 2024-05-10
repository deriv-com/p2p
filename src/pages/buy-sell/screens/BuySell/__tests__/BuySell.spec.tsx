import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { render, screen } from '@testing-library/react';
import BuySell from '../BuySell';

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    TemporarilyBarredHint: () => <div>TemporarilyBarredHint</div>,
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
}));

jest.mock('../../BuySellTable/BuySellTable', () => jest.fn(() => <div>BuySellTable</div>));

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
});
