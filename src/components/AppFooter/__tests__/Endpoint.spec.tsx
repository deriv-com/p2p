import { BrowserRouter } from 'react-router-dom';
import { ENDPOINT } from '@/constants';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';
import { render, screen } from '@testing-library/react';
import Endpoint from '../Endpoint';

const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};

    return {
        clear() {
            store = {};
        },
        getItem(key: string) {
            return store[key] || null;
        },
        removeItem(key: string) {
            delete store[key];
        },
        setItem(key: string, value: string) {
            store[key] = value;
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

describe('Endpoint component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders correctly when server URL is set in localStorage', () => {
        const serverURL = 'https://example.com';
        LocalStorageUtils.setValue<string>(LocalStorageConstants.configAppId, serverURL);

        render(
            <BrowserRouter>
                <Endpoint />
            </BrowserRouter>
        );

        const linkElement = screen.getByRole('link', { name: 'endpoint' });
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', ENDPOINT);
    });

    it('does not render when server URL is not set in localStorage', () => {
        render(
            <BrowserRouter>
                <Endpoint />
            </BrowserRouter>
        );

        expect(screen.queryByText(/The server endpoint is:/)).not.toBeInTheDocument();
    });
});
