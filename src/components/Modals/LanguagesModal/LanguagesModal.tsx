import { LANGUAGES } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './LanguagesModal.scss';

type TLanguagesModalProps = {
    isModalOpen: boolean;
    onClose: () => void;
};

const LanguagesModal = ({ isModalOpen, onClose }: TLanguagesModalProps) => {
    const { currentLang, switchLanguage } = useTranslations();

    return (
        <Modal ariaHideApp={false} className='languages-modal' isOpen={isModalOpen}>
            <Modal.Header hideBorder onRequestClose={onClose}>
                <Text weight='bold'>{'Select Language'}</Text>
            </Modal.Header>
            <Modal.Body className='languages-modal__body'>
                {LANGUAGES.map(language => {
                    const LanguageIcon = language.icon;
                    return (
                        <Button
                            className='languages-modal__body-button'
                            color='black'
                            icon={<LanguageIcon />}
                            key={language.code}
                            onClick={() => {
                                switchLanguage(language.code);
                                onClose();
                            }}
                            variant='ghost'
                        >
                            <Text size='sm' weight={currentLang === language.code ? 'bold' : 'normal'}>
                                {language.display_name}
                            </Text>
                        </Button>
                    );
                })}
            </Modal.Body>
        </Modal>
    );
};

export default LanguagesModal;
