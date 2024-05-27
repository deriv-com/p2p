import { LANGUAGES } from '@/constants';
import { useModalManager } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { DesktopLanguagesModal } from '@deriv-com/ui';
import AccountLimits from './AccountLimits';
import ChangeTheme from './ChangeTheme';
import Deriv from './Deriv';
import Endpoint from './Endpoint';
import FullScreen from './FullScreen';
import HelpCentre from './HelpCentre';
import LanguageSettings from './LanguageSettings';
import Livechat from './Livechat';
import { NetworkStatus } from './NetworkStatus';
import ResponsibleTrading from './ResponsibleTrading';
import { ServerTime } from './ServerTime';
import WhatsApp from './WhatsApp';
import './AppFooter.scss';

const AppFooter = () => {
    const { currentLang = 'EN', localize, switchLanguage } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    const openLanguageSettingModal = () => showModal('DesktopLanguagesModal');

    return (
        <footer className='app-footer'>
            <FullScreen />
            <LanguageSettings openLanguageSettingModal={openLanguageSettingModal} />
            <HelpCentre />
            <div className='app-footer__vertical-line' />
            <ChangeTheme />
            <AccountLimits />
            <ResponsibleTrading />
            <Deriv />
            <Livechat />
            <WhatsApp />
            <div className='app-footer__vertical-line' />
            <ServerTime />
            <div className='app-footer__vertical-line' />
            <NetworkStatus />
            <Endpoint />

            {isModalOpenFor('DesktopLanguagesModal') && (
                <DesktopLanguagesModal
                    headerTitle={localize('Select Language')}
                    isModalOpen
                    languages={LANGUAGES}
                    onClose={hideModal}
                    onLanguageSwitch={code => switchLanguage(code)}
                    selectedLanguage={currentLang}
                />
            )}
        </footer>
    );
};

export default AppFooter;
