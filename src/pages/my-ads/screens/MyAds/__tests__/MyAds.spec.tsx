import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { render, screen } from '@testing-library/react';
import MyAds from '../MyAds';

jest.mock('@/components/TemporarilyBarredHint', () => ({
    TemporarilyBarredHint: () => <div>TemporarilyBarredHint</div>,
}));

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('../MyAdsTable', () => ({
    MyAdsTable: () => <div>MyAdsTable</div>,
}));

const mockUseIsAdvertiserBarred = useIsAdvertiserBarred as jest.MockedFunction<typeof useIsAdvertiserBarred>;

describe('MyAds', () => {
    it('should render the MyAdsTable component', () => {
        render(<MyAds />);
        expect(screen.getByText('MyAdsTable')).toBeInTheDocument();
        expect(screen.queryByText('TemporarilyBarredHint')).not.toBeInTheDocument();
    });

    it('should render the TemporarilyBarredHint component if advertiser is barred', () => {
        mockUseIsAdvertiserBarred.mockReturnValue(true);
        render(<MyAds />);
        expect(screen.getByText('TemporarilyBarredHint')).toBeInTheDocument();
    });
});
