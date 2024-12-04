import Cookies from 'js-cookie';

export const removeCookies = (...cookieNames: string[]) => {
    const domains = [`.${document.domain.split('.').slice(-2).join('.')}`, `.${document.domain}`];

    let parentPath = window.location.pathname.split('/', 2)[1];
    if (parentPath !== '') {
        parentPath = `/${parentPath}`;
    }

    cookieNames.forEach(c => {
        Cookies.remove(c, { domain: domains[0], path: '/' });
        Cookies.remove(c, { domain: domains[1], path: '/' });
        Cookies.remove(c);
        if (new RegExp(c).test(document.cookie) && parentPath) {
            Cookies.remove(c, { domain: domains[0], path: parentPath });
            Cookies.remove(c, { domain: domains[1], path: parentPath });
            Cookies.remove(c, { path: parentPath });
        }
    });
};
