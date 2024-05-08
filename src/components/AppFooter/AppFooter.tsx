import { LanguagesModal } from '@/components/Modals';
import { useModalManager } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Footer } from '@deriv-com/ui';
import './AppFooter.scss';

// TODO: handle local storage values not updating after changing local storage values
const AppFooter = () => {
    const { currentLang } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });

    return (
        <Footer className='app-footer'>
            <Button onClick={() => showModal('LanguagesModal')}>{currentLang}</Button>
            {isModalOpenFor('LanguagesModal') && <LanguagesModal isModalOpen onClose={hideModal} />}
        </Footer>
    );
};

export default AppFooter;
