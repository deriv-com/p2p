import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Verification from '../Verification';

let mockUsePoiPoaStatusData = {
    data: {
        isP2PPoaRequired: 1,
        isPoaPending: false,
        isPoaVerified: false,
        isPoiPending: false,
        isPoiVerified: false,
        poaStatus: 'none',
        poiStatus: 'none',
    },
    isLoading: true,
};

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
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

    it('should ask user to upload their documents if isLoading is false and poi/poa status is none', () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };

        render(<Verification />);

        expect(screen.getByText('Verify your P2P account')).toBeInTheDocument();
        expect(screen.getByText('Verify your identity and address to use Deriv P2P.')).toBeInTheDocument();
        expect(screen.getByText('Upload documents to verify your identity.')).toBeInTheDocument();
        expect(screen.getByText('Upload documents to verify your address.')).toBeInTheDocument();
    });

    it('should redirect user to proof-of-identity route if user clicks on arrow button', async () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };

        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://test.com',
            },
            writable: true,
        });

        render(<Verification />);

        const poiButton = screen.getByTestId('dt_verification_poi_arrow_button');
        expect(poiButton).toBeInTheDocument();

        await userEvent.click(poiButton);

        expect(window.location.href).toBe('https://app.deriv.com/account/proof-of-identity?ext_platform_url=/p2p');
    });

    it('should redirect user to proof-of-address route if user clicks on arrow button', async () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };

        render(<Verification />);

        const poaButton = screen.getByTestId('dt_verification_poa_arrow_button');
        expect(poaButton).toBeInTheDocument();

        await userEvent.click(poaButton);

        expect(window.location.href).toBe('https://app.deriv.com/account/proof-of-address?ext_platform_url=/p2p');
    });

    it('should update url with search params if user clicks on arrow button and url has search params', async () => {
        mockUsePoiPoaStatusData = {
            ...mockUsePoiPoaStatusData,
            isLoading: false,
        };

        render(<Verification />);

        const poiButton = screen.getByTestId('dt_verification_poi_arrow_button');
        expect(poiButton).toBeInTheDocument();

        await userEvent.click(poiButton);

        expect(window.location.href).toBe('https://app.deriv.com/account/proof-of-identity?ext_platform_url=/p2p');
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

        const poaButton = screen.getAllByRole('button')[0];
        const poiButton = screen.getAllByRole('button')[1];

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
                poaStatus: 'rejected',
                poiStatus: 'rejected',
            },
            isLoading: false,
        };

        render(<Verification />);

        expect(screen.getByText('Identity verification failed. Please try again.')).toBeInTheDocument();
        expect(screen.getByText('Address verification failed. Please try again.')).toBeInTheDocument();
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

        expect(screen.getByText('Identity verification complete.')).toBeInTheDocument();
        expect(screen.getByText('Address verification complete.')).toBeInTheDocument();
    });
});
