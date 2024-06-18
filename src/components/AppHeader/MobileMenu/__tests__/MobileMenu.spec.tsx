import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { useModalManager, useNetworkStatus } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from '../MobileMenu';

jest.mock('@/hooks', () => ({
    useModalManager: jest.fn(),
    useNetworkStatus: jest.fn(),
    useSyncedTime: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: false })),
}));

jest.mock('@deriv-com/api-hooks', () => ({
    useAuthData: jest.fn().mockReturnValue({
        isAuthorized: true,
    }),
}));

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn(),
}));

const MobileMenuComponent = () => (
    <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter5Adapter}>
            <MobileMenu />
        </QueryParamProvider>
    </BrowserRouter>
);

describe('MobileMenu component', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            value: jest.fn(),
            writable: true,
        });

        (useModalManager as jest.Mock).mockReturnValue({
            hideModal: jest.fn(),
            isModalOpenFor: jest.fn().mockReturnValue(false),
            showModal: jest.fn(),
        });
        (useNetworkStatus as jest.Mock).mockReturnValue('online');
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'EN',
            localize: jest.fn(text => text),
        });
    });

    it('should not render when isDesktop is true', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: true }));
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
    });

    it('should render toggle button and handle click', async () => {
        render(<MobileMenuComponent />);
        expect(screen.queryByText('Menu')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Menu')).toBeInTheDocument();
    });

    it('should open the language settings', async () => {
        const { isModalOpenFor, showModal } = useModalManager();

        render(<MobileMenuComponent />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByText('EN')).toBeInTheDocument();

        await userEvent.click(screen.getByText('EN'));

        expect(showModal).toHaveBeenCalledWith('MobileLanguagesDrawer');
        expect(isModalOpenFor).toHaveBeenCalledWith('MobileLanguagesDrawer');
    });
});
