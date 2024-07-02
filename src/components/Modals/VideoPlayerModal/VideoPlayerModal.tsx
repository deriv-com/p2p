import { LabelPairedCircleXmarkMdFillIcon } from '@deriv/quill-icons';
import { Modal } from '@deriv-com/ui';
import './VideoPlayerModal.scss';

type TVideoPlayerModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
    title: string;
    url: string;
};

const VideoPlayerModal = ({ isModalOpen, onRequestClose, title, url }: TVideoPlayerModalProps) => {
    return (
        <Modal
            ariaHideApp={false}
            className='video-player-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick
        >
            <Modal.Body>
                <LabelPairedCircleXmarkMdFillIcon
                    className='video-player-modal__close-btn'
                    data-testid='dt_video_player_modal_close_btn'
                    fill='#ffffff'
                    onClick={onRequestClose}
                />
                <iframe height='100%' src={url} title={title} width='100%' />
            </Modal.Body>
        </Modal>
    );
};

export default VideoPlayerModal;
