import { MY_ADS_URL } from '@/constants';
import { useIsAdvertiser } from '@/hooks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyAdsEmpty from '../MyAdsEmpty';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

const mockFn = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockFn,
    }),
}));

const mockUseModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('@/components/Modals', () => ({
    NicknameModal: jest.fn(() => <div>NicknameModal</div>),
}));

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useIsAdvertiser: jest.fn().mockReturnValue(true),
    useModalManager: jest.fn(() => mockUseModalManager),
}));

const mockUseIsAdvertiser = useIsAdvertiser as jest.MockedFunction<typeof useIsAdvertiser>;

describe('MyAdsEmpty', () => {
    it('should render the empty ads section as expected', () => {
        render(<MyAdsEmpty />);
        expect(screen.getByText('You have no ads 😞')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create new ad' })).toBeInTheDocument();
    });
    it('should call history.push when user clicks on Create new Ad if the user is an advertiser', async () => {
        mockUseModalManager.isModalOpenFor.mockReturnValue(false);
        render(<MyAdsEmpty />);
        const createNewAdButton = screen.getByRole('button', { name: 'Create new ad' });
        await userEvent.click(createNewAdButton);
        expect(mockFn).toHaveBeenCalledWith(`${MY_ADS_URL}/adForm?formAction=create`);
    });

    it('should call showModal when user clicks on Create new Ad if the user is not an advertiser', async () => {
        mockUseModalManager.isModalOpenFor.mockImplementation((modalName: string) => modalName === 'NicknameModal');
        mockUseIsAdvertiser.mockReturnValue(false);
        render(<MyAdsEmpty />);
        const createNewAdButton = screen.getByRole('button', { name: 'Create new ad' });
        await userEvent.click(createNewAdButton);
        expect(mockUseModalManager.showModal).toHaveBeenCalledWith('NicknameModal');
    });
});
