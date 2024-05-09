import { LanguagesModal } from '@/components/Modals';
import { LANGUAGES } from '@/constants';
import { useModalManager } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Footer } from '@deriv-com/ui';
import './AppFooter.scss';

// TODO: handle local storage values not updating after changing local storage values
const AppFooter = () => {
    const { currentLang } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });
    const CountryIcon = LANGUAGES.find(lang => lang.code === currentLang)?.icon;

    return (
        <Footer className='app-footer'>
            <Button
                className='app-footer__language-btn'
                color='black'
                icon={<CountryIcon iconSize='sm' />}
                onClick={() => showModal('LanguagesModal')}
                size='sm'
                variant='ghost'
            >
                {currentLang}
            </Button>
            {isModalOpenFor('LanguagesModal') && <LanguagesModal isModalOpen onClose={hideModal} />}
        </Footer>
    );
};

export default AppFooter;
