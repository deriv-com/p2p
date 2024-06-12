import { useState } from 'react';
import NetworkStatus from '@/components/AppFooter/NetworkStatus';
import ServerTime from '@/components/AppFooter/ServerTime';
import { LANGUAGES } from '@/constants';
import { useModalManager } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { Drawer, MobileLanguagesDrawer, useDevice } from '@deriv-com/ui';
import { BackButton } from './BackButton';
import { MenuContent } from './MenuContent';
import { MenuHeader } from './MenuHeader';
import { ToggleButton } from './ToggleButton';

// TODO the design inside LanguageSwitcher dose not match the production => change from ui side
// TODO hide hover of platformswitcher in tablet view

export const MobileMenu = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { currentLang = 'EN', localize, switchLanguage } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { isDesktop } = useDevice();

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const openLanguageSetting = () => showModal('MobileLanguagesDrawer');
    const isLanguageSettingVisible = Boolean(isModalOpenFor('MobileLanguagesDrawer'));

    if (isDesktop) return null;
    return (
        <>
            <ToggleButton onClick={openDrawer} />

            <Drawer isOpen={isDrawerOpen} onCloseDrawer={closeDrawer} width='295px'>
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
                                onLanguageSwitch={code => switchLanguage(code)}
                                selectedLanguage={currentLang}
                            />
                        </>
                    ) : (
                        <MenuContent />
                    )}
                </Drawer.Content>

                <Drawer.Footer className='justify-center h-[40px]'>
                    <ServerTime />
                    <NetworkStatus />
                </Drawer.Footer>
            </Drawer>
        </>
    );
};
