import { useTranslations } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './LanguagesModal.scss';

type TLanguagesModalProps = {
    isModalOpen: boolean;
    onClose: () => void;
};

const allowed_languages = {
    AR: 'العربية',
    BN: 'বাংলা',
    DE: 'Deutsch',
    EN: 'English',
    ES: 'Español',
    FR: 'Français',
    IT: 'Italiano',
    KO: '한국어',
    PL: 'Polish',
    PT: 'Português',
    RU: 'Русский',
    SI: 'සිංහල',
    TH: 'ไทย',
    TR: 'Türkçe',
    VI: 'Tiếng Việt',
    ZH_CN: '简体中文',
    ZH_TW: '繁體中文',
};

const LanguagesModal = ({ isModalOpen, onClose }: TLanguagesModalProps) => {
    const { switchLanguage } = useTranslations();

    return (
        <Modal ariaHideApp={false} className='languages-modal' isOpen={isModalOpen} shouldCloseOnOverlayClick={false}>
            <Modal.Header hideBorder>
                <Text weight='bold'>{'Select Language'}</Text>
            </Modal.Header>
            <Modal.Body className='languages-modal__body'>
                {Object.keys(allowed_languages).map(language_key => {
                    return (
                        <Button
                            color='black'
                            key={language_key}
                            onClick={() => {
                                switchLanguage(language_key);
                                onClose();
                            }}
                            variant='ghost'
                        >
                            {allowed_languages[language_key]}
                        </Button>
                    );
                })}
            </Modal.Body>
        </Modal>
    );
};

export default LanguagesModal;
