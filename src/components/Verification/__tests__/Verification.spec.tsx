import { fireEvent, render, screen } from '@testing-library/react';
import Verification from '../Verification';

let mockUsePoiPoaStatusData = {
    data: {
        isP2PPoaRequired: 1,
        isPoaAuthenticatedWithIdv: false,
        isPoaPending: false,
        isPoaVerified: false,
        isPoiPending: false,
        isPoiVerified: false,
        poaStatus: 'none',
        poiStatus: 'none',
    },
    isLoading: true,
};

let mockUseGetPhoneNumberVerificationData = {
    isPhoneNumberVerificationEnabled: false,
    isPhoneNumberVerified: false,
    phoneNumber: '1234567890',
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useGetPhoneNumberVerification: jest.fn(() => mockUseGetPhoneNumberVerificationData),
    usePoiPoaStatus: jest.fn(() => mockUsePoiPoaStatusData),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

describe('<Verification />', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
            },
            writable: true,
        });
    });
    it('should show Loader if isLoading is true', () => {
        render(<Verification />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should not show phone number verification if isPhoneNumberVerificationEnabled is false', () => {
        render(<Verification />);
        expect(screen.queryByText('Your phone number')).not.toBeInTheDocument();
    });

    it('should ask user to upload their documents and add their phone number if isLoading is false and poi/poa status is none and isPhoneNumberVerificationEnabled is true', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };
        mockUseGetPhoneNumberVerificationData = {
            ...mockUseGetPhoneNumberVerificationData,
            isPhoneNumberVerificationEnabled: true,
        };

        render(<Verification />);

        expect(screen.getByText('Let’s get you secured')).toBeInTheDocument();
        expect(screen.getByText('Complete your P2P profile to enjoy secure transactions.')).toBeInTheDocument();
        expect(screen.getByText('Your phone number')).toBeInTheDocument();
        expect(screen.getByText('Your identity')).toBeInTheDocument();
        expect(screen.getByText('Your address')).toBeInTheDocument();
    });

    it('should redirect user to account/personal-details route if user clicks on phone number arrow button', () => {
        render(<Verification />);

        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
            },
            writable: true,
        });

        const phoneNumberButton = screen.getByTestId('dt_verification_phone_number_arrow_button');
        expect(phoneNumberButton).toBeInTheDocument();

        fireEvent.click(phoneNumberButton);

        expect(window.location.href).toBe('https://staging-app.deriv.com/account/personal-details?platform=p2p-v2');
    });

    it('should redirect user to proof-of-identity route if user clicks on arrow button', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };

        render(<Verification />);

        const poiButton = screen.getByTestId('dt_verification_poi_arrow_button');
        expect(poiButton).toBeInTheDocument();

        fireEvent.click(poiButton);

        expect(window.location.href).toBe(
            'https://staging-app.deriv.com/account/proof-of-identity?ext_platform_url=/cashier/p2p&platform=p2p-v2'
        );
    });

    it('should redirect user to proof-of-address route if user clicks on arrow button', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };

        render(<Verification />);

        const poaButton = screen.getByTestId('dt_verification_poa_arrow_button');
        expect(poaButton).toBeInTheDocument();

        fireEvent.click(poaButton);

        expect(window.location.href).toBe(
            'https://staging-app.deriv.com/account/proof-of-address?ext_platform_url=/cashier/p2p&platform=p2p-v2'
        );
    });

    it('should update url with search params if user clicks on arrow button and url has search params', async () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };

        window.location.search = 'param1=value1&param2=value2';

        render(<Verification />);

        const poiButton = screen.getByTestId('dt_verification_poi_arrow_button');
        expect(poiButton).toBeInTheDocument();

        fireEvent.click(poiButton);

        expect(window.location.href).toBe(
            'https://staging-app.deriv.com/account/proof-of-identity?ext_platform_url=/cashier/p2p&platform=p2p-v2&param1=value1&param2=value2'
        );
    });

    it('should show the pending message if poi/poa status is pending and poi/poa buttons are disabled', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            data: {
                ...mockUsePoiPoaStatusData.data,
                isPoaPending: true,
                isPoiPending: true,
                poaStatus: 'pending',
                poiStatus: 'pending',
            },
            isLoading: false,
        };

        render(<Verification />);

        const poaButton = screen.getAllByRole('button')[1];
        const poiButton = screen.getAllByRole('button')[2];

        expect(screen.getByText('Identity verification in progress.')).toBeInTheDocument();
        expect(screen.getByText('Address verification in progress.')).toBeInTheDocument();
        expect(poaButton).toBeDisabled();
        expect(poiButton).toBeDisabled();
    });

    it('should show rejected message if poi/poa status is rejected', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            data: {
                ...mockUsePoiPoaStatusData.data,
                isPoaPending: false,
                isPoiPending: false,
                poaStatus: 'rejected',
                poiStatus: 'rejected',
            },
            isLoading: false,
        };

        render(<Verification />);

        expect(screen.getByText('Identity verification failed. Please try again.')).toBeInTheDocument();
        expect(screen.getByText('Address verification failed. Please try again.')).toBeInTheDocument();
    });

    it('should show verified message and phone number if phone number is verified', () => {
        mockUseGetPhoneNumberVerificationData = {
            ...mockUseGetPhoneNumberVerificationData,
            isPhoneNumberVerified: true,
        };

        render(<Verification />);

        expect(screen.getByText('Phone number verified')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
    });

    it('should show verified message if poi/poa status is verified', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            data: {
                ...mockUsePoiPoaStatusData.data,
                poaStatus: 'verified',
                poiStatus: 'verified',
            },
            isLoading: false,
        };

        render(<Verification />);

        expect(screen.getByText('Identity verified')).toBeInTheDocument();
        expect(screen.getByText('Address verified')).toBeInTheDocument();
    });

    it('should should prompt user to upload documents if isPoaAuthenticatedWithIdv is true', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            data: { ...mockUsePoiPoaStatusData.data, isPoaAuthenticatedWithIdv: true },
        };

        render(<Verification />);

        expect(screen.getByText('Upload documents to verify your address.')).toBeInTheDocument();
    });
});
