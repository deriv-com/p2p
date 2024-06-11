import { TAdvertiserStats } from 'types';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import ProfileContent from '../ProfileContent';

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    AdvertiserName: () => <div>AdvertiserName</div>,
    AdvertiserNameToggle: () => <div>AdvertiserNameToggle</div>,
}));

jest.mock('../ProfileBalance', () => ({
    ProfileBalance: () => <div>ProfileBalance</div>,
}));

jest.mock('../ProfileStats', () => ({
    ProfileStats: () => <div>ProfileStats</div>,
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockUseDevice = useDevice as jest.Mock;

const mockProps = {
    data: {
        isAddressVerified: false,
        isIdentityVerified: false,
        totalOrders: 10,
    } as TAdvertiserStats,
};

describe('ProfileContent', () => {
    it('should render the advertiser name and profile balance if location is my-profile', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com/my-profile',
            },
            writable: true,
        });
        render(<ProfileContent {...mockProps} />);
        expect(screen.getByText('AdvertiserName')).toBeInTheDocument();
        expect(screen.getByText('ProfileBalance')).toBeInTheDocument();
    });

    it('should render the advertiser name and profile stats if location is advertiser', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com/advertiser',
            },
            writable: true,
        });
        render(<ProfileContent {...mockProps} />);
        expect(screen.getByText('AdvertiserName')).toBeInTheDocument();
        expect(screen.getByText('ProfileStats')).toBeInTheDocument();
    });

    it('should render the AdvertiserNameToggle if isMobile is true and location is my-profile', () => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com/my-profile',
            },
            writable: true,
        });

        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<ProfileContent {...mockProps} />);
        expect(screen.getByText('AdvertiserNameToggle')).toBeInTheDocument();
    });
});
