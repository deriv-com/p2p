import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { useFullScreen, useModalManager, useNetworkStatus } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppFooter from '../AppFooter';

jest.mock('@deriv-com/translations');
jest.mock('@/hooks');

Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(query => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(), // Deprecated
        dispatchEvent: jest.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(), // Deprecated
    })),
    writable: true,
});

const AppFooterComponent = () => (
    <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter5Adapter}>
            <AppFooter />
        </QueryParamProvider>
    </BrowserRouter>
);

describe('AppFooter', () => {
    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue({
            currentLang: 'EN',
            localize: jest.fn().mockImplementation(key => key),
            switchLanguage: jest.fn(),
        });

        (useModalManager as jest.Mock).mockReturnValue({
            hideModal: jest.fn(),
            isModalOpenFor: jest.fn().mockReturnValue(false),
            showModal: jest.fn(),
        });

        (useFullScreen as jest.Mock).mockReturnValue({
            toggleFullScreenMode: jest.fn(),
        });

        (useNetworkStatus as jest.Mock).mockReturnValue('online');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the footer elements', () => {
        render(<AppFooterComponent />);
        expect(screen.getAllByRole('button')).toHaveLength(4);
        expect(screen.getAllByRole('link')).toHaveLength(5);
    });

    it('opens and closes the language settings modal', async () => {
        const { hideModal, isModalOpenFor, showModal } = useModalManager();

        render(<AppFooterComponent />);

        await userEvent.click(screen.getByText('EN'));

        expect(showModal).toHaveBeenCalledWith('DesktopLanguagesModal');
        expect(isModalOpenFor).toHaveBeenCalledWith('DesktopLanguagesModal');

        (isModalOpenFor as jest.Mock).mockReturnValue(true);
        render(<AppFooterComponent />);
        expect(screen.getByText('Select Language')).toBeInTheDocument();

        await userEvent.click(screen.getByTestId('dt-close-icon'));
        expect(hideModal).toHaveBeenCalled();
    }, 10000);
});
