import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { useModalManager } from '@/hooks';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from '../MobileMenu';

const mockModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn().mockReturnValue(false),
    showModal: jest.fn(),
};

const mockCreateNewConnection = jest.fn();

const mockSwitchLanguage = jest.fn();

jest.mock('@/hooks', () => ({
    useModalManager: jest.fn(() => mockModalManager),
    useNetworkStatus: jest.fn().mockReturnValue('online'),
    useSyncedTime: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    useAPI: jest.fn(() => ({
        derivAPIClient: {
            createNewConnection: mockCreateNewConnection,
        },
    })),
    useAuthData: jest.fn().mockReturnValue({
        isAuthorized: true,
    }),
}));

jest.mock('@deriv-com/translations', () => ({
    getAllowedLanguages: jest.fn(() => ({ EN: 'English' })),
    useTranslations: jest.fn(() => ({
        currentLang: 'EN',
        localize: jest.fn(text => text),
        switchLanguage: mockSwitchLanguage,
    })),
}));

const MobileMenuComponent = () => (
    <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter5Adapter}>
            <MobileMenu />
        </QueryParamProvider>
    </BrowserRouter>
);

describe('MobileMenu component', () => {
    it('should not render when isDesktop is true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });

    it('should render toggle button and handle click', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Menu')).toBeInTheDocument();
    });

    it('should open the language settings', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        const { isModalOpenFor, showModal } = useModalManager();

        render(<MobileMenuComponent />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('EN')).toBeInTheDocument();

        await userEvent.click(screen.getByText('EN'));

        expect(showModal).toHaveBeenCalledWith('MobileLanguagesDrawer');
        expect(isModalOpenFor).toHaveBeenCalledWith('MobileLanguagesDrawer');
    });

    it('should call createNewConnection and switchLanguage on language switch', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        mockModalManager.isModalOpenFor.mockImplementation((modal: string) => modal === 'MobileLanguagesDrawer');
        const { isModalOpenFor, showModal } = useModalManager();

        render(<MobileMenuComponent />);
        await userEvent.click(screen.getByRole('button'));

        expect(showModal).toHaveBeenCalledWith('MobileLanguagesDrawer');
        expect(isModalOpenFor).toHaveBeenCalledWith('MobileLanguagesDrawer');

        await userEvent.click(screen.getByText('English'));

        expect(mockCreateNewConnection).toHaveBeenCalled();
        expect(mockSwitchLanguage).toHaveBeenCalled();
    });
});
