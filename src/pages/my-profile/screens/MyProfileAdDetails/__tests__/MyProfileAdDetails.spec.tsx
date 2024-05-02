import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyProfileAdDetails from '../MyProfileAdDetails';

const mockUseAdvertiserInfo = {
    data: {},
    isLoading: true,
};

const mockMutateAdvertiser = jest.fn();
const mockUseUpdateAdvertiser = {
    data: {
        contact_info: '',
        default_advert_description: '',
    },
    isLoading: false,
    mutate: mockMutateAdvertiser,
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

describe('MyProfileBalance', () => {
    it('should render the loader when initial data is fetching', () => {
        render(<MyProfileAdDetails />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
        mockUseAdvertiserInfo.isLoading = false;
    });
    it('should render initial default details when user has not updated their details yet', () => {
        mockUseAdvertiserInfo.data = {};
        render(<MyProfileAdDetails />);
        const contactTextAreaNode = screen.getByTestId('dt_profile_ad_details_contact');
        expect(within(contactTextAreaNode).getByRole('textbox')).toHaveValue('');
        const descriptionTextAreaNode = screen.getByTestId('dt_profile_ad_details_description');
        expect(within(descriptionTextAreaNode).getByRole('textbox')).toHaveValue('');
    });
    it('should render initial empty details when user has not updated their details yet', () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '',
            default_advert_description: '',
        };
        render(<MyProfileAdDetails />);
        const contactTextAreaNode = screen.getByTestId('dt_profile_ad_details_contact');
        expect(within(contactTextAreaNode).getByRole('textbox')).toHaveValue('');
        const descriptionTextAreaNode = screen.getByTestId('dt_profile_ad_details_description');
        expect(within(descriptionTextAreaNode).getByRole('textbox')).toHaveValue('');
    });
    it('should render initial details when user has previously updated their details', () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '0123456789',
            default_advert_description: 'mock description',
        };
        render(<MyProfileAdDetails />);
        const contactTextAreaNode = screen.getByTestId('dt_profile_ad_details_contact');
        expect(within(contactTextAreaNode).getByRole('textbox')).toHaveValue('0123456789');
        const descriptionTextAreaNode = screen.getByTestId('dt_profile_ad_details_description');
        expect(within(descriptionTextAreaNode).getByRole('textbox')).toHaveValue('mock description');
    });
    it('should render and post updated details when user updates their details', async () => {
        mockUseAdvertiserInfo.data = {
            contact_info: '0123456789',
            default_advert_description: 'mock description',
        };
        render(<MyProfileAdDetails />);
        const contactTextBoxNode = within(screen.getByTestId('dt_profile_ad_details_contact')).getByRole('textbox');
        const descriptionTextBoxNode = within(screen.getByTestId('dt_profile_ad_details_description')).getByRole(
            'textbox'
        );
        const submitBtn = screen.getByRole('button', {
            name: 'Save',
        });
        // tests by default if not edited, button should be disabled
        expect(submitBtn).toBeDisabled();
        await userEvent.type(contactTextBoxNode, '0');
        await userEvent.type(descriptionTextBoxNode, ' here');
        expect(submitBtn).toBeEnabled();

        await userEvent.click(submitBtn);
        expect(mockMutateAdvertiser).toBeCalledWith({
            contact_info: '01234567890',
            default_advert_description: 'mock description here',
        });
    });
    it('should render mobile screen', async () => {
        mockUseDevice.isMobile = true;
        render(<MyProfileAdDetails />);
        const contactTextBoxNode = within(screen.getByTestId('dt_profile_ad_details_contact')).getByRole('textbox');
        const descriptionTextBoxNode = within(screen.getByTestId('dt_profile_ad_details_description')).getByRole(
            'textbox'
        );
        expect(contactTextBoxNode).toBeInTheDocument();
        expect(descriptionTextBoxNode).toBeInTheDocument();

        const goBackBtn = screen.getByTestId('dt_mobile_wrapper_button');
        await userEvent.click(goBackBtn);
        expect(mockSetQueryString).toBeCalledWith({
            tab: 'default',
        });
    });
});
