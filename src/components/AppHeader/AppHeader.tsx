import { useAuthData } from '@deriv-com/api-hooks';
import { Button, Header } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils, URLConstants, URLUtils } from '@deriv-com/utils';
import './AppHeader.scss';

// TODO: handle local storage values not updating after changing local storage values
const AppHeader = () => {
    const { activeLoginid, logout } = useAuthData();
    const appId = LocalStorageUtils.getValue(LocalStorageConstants.configAppId);
    const serverUrl = localStorage.getItem(LocalStorageConstants.configServerURL.toString());
    const oauthUrl =
        appId && serverUrl
            ? `https://${serverUrl}/oauth2/authorize?app_id=${appId}&l=EN&&brand=deriv`
            : URLUtils.getOauthURL();

    return (
        <Header className='app-header'>
            <Header.DerivLogo
                href={URLConstants.deriv}
                logoHeight={30}
                logoWidth={30}
                target='_blank'
                variant='wallets'
            />
            {activeLoginid ? (
                <Button onClick={logout}>Logout</Button>
            ) : (
                <a
                    className='bg-solid-coral-800 text-body-sm text-opacity-white-800 rounded-200 px-800 py-300 font-bold'
                    href={oauthUrl}
                >
                    Login
                </a>
            )}
        </Header>
    );
};

export default AppHeader;
