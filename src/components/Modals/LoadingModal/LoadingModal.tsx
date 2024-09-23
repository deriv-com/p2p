import { Loader, Modal } from '@deriv-com/ui';
import './LoadingModal.scss';

const LoadingModal = ({ isModalOpen }: { isModalOpen: boolean }) => {
    return (
        <Modal ariaHideApp={false} className='loading-modal' isOpen={isModalOpen}>
            <Modal.Body>
                <Loader />
            </Modal.Body>
        </Modal>
    );
};

export default LoadingModal;
