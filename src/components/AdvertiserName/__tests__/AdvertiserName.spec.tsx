import { render, screen } from '@testing-library/react';
import AdvertiserName from '../AdvertiserName';

const mockProps = {
    advertiserStats: {
        first_name: 'Jane',
        last_name: 'Doe',
        name: 'Jane',
        shouldShowName: true,
    },
};

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};
jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        settings: {
            useSettings: jest.fn(() => ({ pnv_required: false })),
        },
    },
    useGetPhoneNumberVerification: jest.fn(() => ({
        isPhoneNumberVerificationEnabled: false,
        isPhoneNumberVerified: false,
    })),
    useIsRtl: jest.fn(() => false),
    useModalManager: jest.fn(() => mockModalManager),
}));

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
    getCurrentRoute: jest.fn(() => 'my-profile'),
}));

jest.mock('../AdvertiserNameStats.tsx', () => ({
    __esModule: true,
    default: () => <div>AdvertiserNameStats</div>,
}));

describe('AdvertiserName', () => {
    it('should render full name', () => {
        render(<AdvertiserName {...mockProps} />);
        expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    });
});
