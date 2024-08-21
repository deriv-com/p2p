import { useState } from 'react';
import NetworkStatus from '@/components/AppFooter/NetworkStatus';
import ServerTime from '@/components/AppFooter/ServerTime';
import { LANGUAGES } from '@/constants';
import { useModalManager } from '@/hooks';
import { useAPI } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Drawer, MobileLanguagesDrawer, useDevice } from '@deriv-com/ui';
import { AppIDConstants, LocalStorageUtils, URLUtils, WebSocketUtils } from '@deriv-com/utils';
import { BackButton } from './BackButton';
import { MenuContent } from './MenuContent';
import { MenuHeader } from './MenuHeader';
import { ToggleButton } from './ToggleButton';

const MobileMenu = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { derivAPIClient } = useAPI();
    const { localize, switchLanguage } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { isDesktop } = useDevice();
    const currentLang = LocalStorageUtils.getValue<string>('i18n_language') || 'EN';

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const openLanguageSetting = () => showModal('MobileLanguagesDrawer');
    const isLanguageSettingVisible = Boolean(isModalOpenFor('MobileLanguagesDrawer'));

    if (isDesktop) return null;
    return (
        <>
            <ToggleButton onClick={openDrawer} />
            <Drawer isOpen={isDrawerOpen} onCloseDrawer={closeDrawer} width='29.5rem'>
                <Drawer.Header onCloseDrawer={closeDrawer}>
                    <MenuHeader
                        hideLanguageSetting={isLanguageSettingVisible}
                        openLanguageSetting={openLanguageSetting}
                    />
                </Drawer.Header>
                <Drawer.Content>
                    {isLanguageSettingVisible ? (
                        <>
                            <BackButton buttonText={localize('Language')} onClick={hideModal} />
                            <MobileLanguagesDrawer
                                isOpen
                                languages={LANGUAGES}
                                onClose={hideModal}
                                onLanguageSwitch={async code => {
                                    const serverURL = `wss://${URLUtils.getServerURL()}/websockets/v3?app_id=${WebSocketUtils.getAppId()}&l=${code}&brand=${AppIDConstants.appBrand}`;
                                    await derivAPIClient.createNewConnection(serverURL);
                                    switchLanguage(code);
                                    closeDrawer();
                                    hideModal();
                                }}
                                selectedLanguage={currentLang}
                                wrapperClassName='px-[0.8rem]'
                            />
                        </>
                    ) : (
                        <MenuContent />
                    )}
                </Drawer.Content>
                <Drawer.Footer className='justify-center h-16'>
                    <ServerTime />
                    <NetworkStatus />
                </Drawer.Footer>
            </Drawer>
        </>
    );
};

export default MobileMenu;
