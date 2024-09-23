import { useGetBusinessHours, useIsAdvertiserBarred, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { render, screen } from '@testing-library/react';
import MyAds from '../MyAds';

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
    useIsAdvertiser: jest.fn(() => false),
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
    usePoiPoaStatus: jest.fn().mockReturnValue({
        data: {
            isPoaVerified: true,
            isPoiVerified: true,
        },
    }),
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

const mockUseGetBusinessHours = useGetBusinessHours as jest.Mock;
const mockUseIsAdvertiserBarred = useIsAdvertiserBarred as jest.MockedFunction<typeof useIsAdvertiserBarred>;
const mockUsePoiPoaStatus = usePoiPoaStatus as jest.MockedFunction<typeof usePoiPoaStatus>;

describe('MyAds', () => {
    it('should render the MyAdsTable component', () => {
        render(<MyAds />);
        expect(screen.getByText('MyAdsTable')).toBeInTheDocument();
        expect(screen.queryByText('TemporarilyBarredHint')).not.toBeInTheDocument();
        expect(screen.queryByText('OutsideBusinessHoursHint')).not.toBeInTheDocument();
    });

    it('should render the TemporarilyBarredHint component if advertiser is barred', () => {
        mockUseIsAdvertiserBarred.mockReturnValue(true);
        render(<MyAds />);
        expect(screen.getByText('TemporarilyBarredHint')).toBeInTheDocument();
        expect(screen.queryByText('OutsideBusinessHoursHint')).not.toBeInTheDocument();
    });

    it('should render the OutsideBusinessHoursHint component if business hours are not available', () => {
        mockUseIsAdvertiserBarred.mockReturnValue(false);
        mockUseGetBusinessHours.mockReturnValue({
            isScheduleAvailable: false,
        });
        render(<MyAds />);
        expect(screen.getByText('OutsideBusinessHoursHint')).toBeInTheDocument();
        expect(screen.queryByText('TemporarilyBarredHint')).not.toBeInTheDocument();
    });

    it('should render the Verification component if POA/POI is not verified is false', () => {
        (mockUsePoiPoaStatus as jest.Mock).mockReturnValue({
            data: {
                isPoaVerified: false,
                isPoiVerified: false,
            },
        });
        render(<MyAds />);
        expect(screen.getByText('Verification')).toBeInTheDocument();
    });
});
