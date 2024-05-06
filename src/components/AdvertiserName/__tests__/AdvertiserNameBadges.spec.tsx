import { render, screen } from '@testing-library/react';
import AdvertiserNameBadges from '../AdvertiserNameBadges';

const mockUseAdvertiserStats = {
    data: {
        isAddressVerified: false,
        isIdentityVerified: false,
        totalOrders: 10,
    },
    isLoading: false,
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

const mockProps = {
    advertiserStats: {
        isAddressVerified: false,
        isIdentityVerified: false,
        totalOrders: 20,
    },
};

describe('AdvertiserNameBadges', () => {
    it('should render not verified badges', () => {
        render(<AdvertiserNameBadges {...mockProps} />);
        expect(screen.queryAllByText('not verified')).toHaveLength(2);
    });
    it('should render verified badges', () => {
        mockProps.advertiserStats = {
            isAddressVerified: true,
            isIdentityVerified: true,
            totalOrders: 20,
        };
        render(<AdvertiserNameBadges {...mockProps} />);
        expect(screen.queryAllByText('verified')).toHaveLength(2);
    });
    it('should render verified/not verified badges', () => {
        mockProps.advertiserStats = {
            isAddressVerified: true,
            isIdentityVerified: false,
            totalOrders: 20,
        };
        render(<AdvertiserNameBadges {...mockProps} />);
        expect(screen.getByText('verified')).toBeInTheDocument();
        expect(screen.getByText('not verified')).toBeInTheDocument();
    });
    it('should render trade badge with 100+ orders', () => {
        mockProps.advertiserStats = {
            isAddressVerified: true,
            isIdentityVerified: true,
            totalOrders: 100,
        };
        render(<AdvertiserNameBadges {...mockProps} />);
        expect(screen.getByText('100+')).toBeInTheDocument();
    });
});
