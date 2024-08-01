import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileAdDetails from '../MyProfileAdDetails';

const mockUseAdvertiserInfo: { data: object | undefined; isLoading: boolean } = {
    data: {},
    isLoading: true,
};

const mockMutateAdvertiser = jest.fn();
const mockReset = jest.fn();
const mockUseUpdateAdvertiser = {
    data: {
        contact_info: '',
        default_advert_description: '',
    },
    isSuccess: false,
    mutate: mockMutateAdvertiser,
    reset: mockReset,
};
const mockUseDevice = {
    isMobile: false,
};
const mockSetQueryString = jest.fn();

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => mockUseDevice),
}));
jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useQueryString: jest.fn(() => ({
        setQueryString: mockSetQueryString,
    })),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advertiser: {
            useGetInfo: jest.fn(() => mockUseAdvertiserInfo),
            useUpdate: jest.fn(() => mockUseUpdateAdvertiser),
        },
    },
}));

const user = userEvent.setup({ delay: null });

describe('MyProfileBalance', () => {
    it('should render initial default details when user has not updated their details yet', () => {
        mockUseAdvertiserInfo.data = {};
        render(<MyProfileAdDetails />);
        const contactTextAreaNode = screen.getByTestId('dt_profile_ad_details_contact');
        expect(contactTextAreaNode).toHaveValue('');
        const descriptionTextAreaNode = screen.getByTestId('dt_profile_ad_details_description');
        expect(descriptionTextAreaNode).toHaveValue('');
    });
    it('should render initial empty details when user has not updated their details yet', () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '',
            default_advert_description: '',
        };
        render(<MyProfileAdDetails />);
        const contactTextAreaNode = screen.getByTestId('dt_profile_ad_details_contact');
        expect(contactTextAreaNode).toHaveValue('');
        const descriptionTextAreaNode = screen.getByTestId('dt_profile_ad_details_description');
        expect(descriptionTextAreaNode).toHaveValue('');
    });
    it('should render initial details when user has previously updated their details', () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '0123456789',
            default_advert_description: 'mock description',
        };
        render(<MyProfileAdDetails />);
        const contactTextAreaNode = screen.getByTestId('dt_profile_ad_details_contact');
        expect(contactTextAreaNode).toHaveValue('0123456789');
        const descriptionTextAreaNode = screen.getByTestId('dt_profile_ad_details_description');
        expect(descriptionTextAreaNode).toHaveValue('mock description');
    });
    it('should render and post updated details when user updates their details', async () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '0123456789',
            default_advert_description: 'mock description',
        };

        render(<MyProfileAdDetails />);
        const contactTextBoxNode = screen.getByTestId('dt_profile_ad_details_contact');
        const descriptionTextBoxNode = screen.getByTestId('dt_profile_ad_details_description');
        const submitBtn = screen.getByRole('button', {
            name: 'Save',
        });
        // tests by default if not edited, button should be disabled
        expect(submitBtn).toBeDisabled();
        await user.type(contactTextBoxNode, '0');
        await user.type(descriptionTextBoxNode, ' here');
        expect(submitBtn).toBeEnabled();

        await user.click(submitBtn);
        expect(mockMutateAdvertiser).toHaveBeenCalledWith({
            contact_info: '01234567890',
            default_advert_description: 'mock description here',
        });

        mockUseUpdateAdvertiser.isSuccess = true;
    });
    it('should render mobile screen', async () => {
        mockUseDevice.isMobile = true;
        render(<MyProfileAdDetails />);
        const contactTextBoxNode = screen.getByTestId('dt_profile_ad_details_contact');
        const descriptionTextBoxNode = screen.getByTestId('dt_profile_ad_details_description');
        expect(contactTextBoxNode).toBeInTheDocument();
        expect(descriptionTextBoxNode).toBeInTheDocument();

        const goBackBtn = screen.getByTestId('dt_mobile_wrapper_button');
        await user.click(goBackBtn);
        expect(mockSetQueryString).toHaveBeenCalledWith({
            tab: 'default',
        });
    });
    it('should show Loader when isLoading is true and advertiserInfo is undefined', () => {
        mockUseAdvertiserInfo.isLoading = true;
        mockUseAdvertiserInfo.data = undefined;
        render(<MyProfileAdDetails />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
});
