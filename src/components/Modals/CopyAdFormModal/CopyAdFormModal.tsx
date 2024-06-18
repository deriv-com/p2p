import { PropsWithChildren } from 'react';
import CopyAdFormFooter from '@/components/CopyAdForm/CopyAdFormFooter';
import CopyAdFormHeader from '@/components/CopyAdForm/CopyAdFormHeader';
import { Modal } from '@deriv-com/ui';
import './CopyAdFormModal.scss';

type TCopyAdFormModalProps = {
    isModalOpen: boolean;
    isValid: boolean;
    onClickCancel: () => void;
    onSubmit: () => void;
};

const CopyAdFormModal = ({
    children,
    isModalOpen,
    isValid,
    onClickCancel,
    onSubmit,
}: PropsWithChildren<TCopyAdFormModalProps>) => {
    return (
        <Modal ariaHideApp={false} className='copy-ad-form-modal' isOpen={isModalOpen}>
            <Modal.Header hideBorder hideCloseIcon>
                <CopyAdFormHeader />
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer className='gap-[0.8rem]' hideBorder>
                <CopyAdFormFooter isValid={isValid} onClickCancel={onClickCancel} onSubmit={onSubmit} />
            </Modal.Footer>
        </Modal>
    );
};

export default CopyAdFormModal;
