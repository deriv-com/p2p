import { render, screen } from '@testing-library/react';
import AdvertiserName from '../AdvertiserName';

const mockProps = {
    advertiserStats: {
        fullName: 'Jane Doe',
        name: 'Jane',
        shouldShowName: true,
    },
};

jest.mock('@deriv-com/api-hooks', () => ({
    ...jest.requireActual('@deriv-com/api-hooks'),
    useGetSettings: jest.fn(() => ({ email: 'test@gmail.com' })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

jest.mock('@/utils', () => ({
    ...jest.requireActual('@/utils'),
    getCurrentRoute: jest.fn(() => ''),
}));

describe('AdvertiserName', () => {
    it('should render full name', () => {
        render(<AdvertiserName {...mockProps} />);
        expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    });
});
