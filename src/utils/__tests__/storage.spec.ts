import Cookies from 'js-cookie';
import { removeCookies } from '../storage';

jest.mock('js-cookie');

describe('removeCookies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: { pathname: '/test' },
            writable: true,
        });
        Object.defineProperty(document, 'domain', {
            value: 'example.com',
            writable: true,
        });
    });

    it('should remove cookies from all specified domains and paths', () => {
        removeCookies('cookie1', 'cookie2');

        expect(Cookies.remove).toHaveBeenCalledWith('cookie1', { domain: '.example.com', path: '/' });
        expect(Cookies.remove).toHaveBeenCalledWith('cookie1', { domain: '.example.com', path: '/' });
        expect(Cookies.remove).toHaveBeenCalledWith('cookie1');
        expect(Cookies.remove).toHaveBeenCalledWith('cookie2', { domain: '.example.com', path: '/' });
        expect(Cookies.remove).toHaveBeenCalledWith('cookie2', { domain: '.example.com', path: '/' });
        expect(Cookies.remove).toHaveBeenCalledWith('cookie2');
    });

    it('should not remove cookies from parent path if it does not exist', () => {
        window.location.pathname = '/';
        removeCookies('cookie1', 'cookie2');

        expect(Cookies.remove).not.toHaveBeenCalledWith('cookie1', { domain: '.example.com', path: '/test' });
        expect(Cookies.remove).not.toHaveBeenCalledWith('cookie2', { domain: '.example.com', path: '/test' });
    });
});
