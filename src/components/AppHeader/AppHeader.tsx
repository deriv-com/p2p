import { useState } from 'react';
import {
    LabelPairedHouseBlankMdRegularIcon,
    LegacyChevronRight2pxIcon,
    LegacyMenuHamburger1pxIcon,
} from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { Button, DerivLogo, Drawer, Header, MenuItem, Text, useDevice, Wrapper } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils, URLUtils } from '@deriv-com/utils';
import './AppHeader.scss';

// TODO: handle local storage values not updating after changing local storage values
const AppHeader = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { isDesktop } = useDevice();
    const { activeLoginid, logout } = useAuthData();
    const appId = LocalStorageUtils.getValue(LocalStorageConstants.configAppId);
    const serverUrl = localStorage.getItem(LocalStorageConstants.configServerURL.toString());
    const oauthUrl =
        appId && serverUrl
            ? `https://${serverUrl}/oauth2/authorize?app_id=${appId}&l=EN&&brand=deriv`
            : URLUtils.getOauthURL();

    return (
        <Header className='app-header'>
            {isDesktop ? (
                <Wrapper variant='left'>
                    <DerivLogo
                        href='https://deriv.com'
                        logoHeight={30}
                        logoWidth={30}
                        target='_blank'
                        variant='wallets'
                    />
                    <MenuItem
                        as='button'
                        className='flex gap-2 p-5'
                        leftComponent={<LabelPairedHouseBlankMdRegularIcon />}
                    >
                        <Text>Trader&apos;s Hub</Text>
                    </MenuItem>
                </Wrapper>
            ) : (
                <Wrapper variant='left'>
                    <Drawer
                        isOpen={isDrawerOpen}
                        onCloseDrawer={() => {
                            setIsDrawerOpen(false);
                        }}
                        width='300px'
                    >
                        <Drawer.Header
                            onCloseDrawer={() => {
                                setIsDrawerOpen(false);
                            }}
                        >
                            <Text>Menu</Text>
                        </Drawer.Header>
                        <Drawer.Content>
                            <div className='flex'>
                                <MenuItem
                                    as='button'
                                    className='flex gap-5 p-5'
                                    leftComponent={<LabelPairedHouseBlankMdRegularIcon />}
                                    rightComponent={<LegacyChevronRight2pxIcon iconSize='xs' />}
                                >
                                    <Text>Trader&apos;s Hub</Text>
                                </MenuItem>
                            </div>
                        </Drawer.Content>
                    </Drawer>
                    <Button
                        icon={<LegacyMenuHamburger1pxIcon iconSize='sm' />}
                        onClick={() => setIsDrawerOpen(true)}
                        variant='ghost'
                    />
                </Wrapper>
            )}
            {activeLoginid ? (
                <Button onClick={logout}>Logout</Button>
            ) : (
                <Button
                    className='w-36'
                    color='primary-light'
                    onClick={() => window.open(oauthUrl, '_self')}
                    variant='ghost'
                >
                    <Text weight='bold'>Log in</Text>
                </Button>
            )}
        </Header>
    );
};

export default AppHeader;
