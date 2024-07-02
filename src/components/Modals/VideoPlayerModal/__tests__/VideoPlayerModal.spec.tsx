import { HOW_TO_USE_DERIV_P2P_URL } from '@/constants';
import { render, screen } from '@testing-library/react';
import VideoPlayerModal from '../VideoPlayerModal';

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
    title: 'How to use the Deriv P2P app',
    url: HOW_TO_USE_DERIV_P2P_URL,
};

describe('<VideoPlayerModal />', () => {
    it('should render the modal', () => {
        render(<VideoPlayerModal {...mockProps} />);

        expect(screen.getByTestId('dt_video_player_modal_close_btn')).toBeInTheDocument();
        expect(screen.getByTitle('How to use the Deriv P2P app')).toHaveAttribute('src', mockProps.url);
    });
});
