import { ReactComponent as ScamAdvancePaymentIcon } from '@/assets/scam-advance-payment.svg';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from '../Carousel';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('Carousel', () => {
    it('should render the Carousel component', () => {
        render(
            <Carousel
                items={[
                    { description: 'Awareness', icon: <ScamAdvancePaymentIcon />, id: 0, title: '1' },
                    { description: 'Videos', icon: <ScamAdvancePaymentIcon />, id: 1, title: '2' },
                ]}
            />
        );
        expect(screen.getByText('Awareness')).toBeInTheDocument();
        expect(screen.getByText('Videos')).toBeInTheDocument();
    });
    it('should show the proper item on click of controls', async () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(
            <Carousel
                items={[
                    { description: 'Awareness', icon: <ScamAdvancePaymentIcon />, id: 0, title: '1' },
                    { description: 'Blog', icon: <ScamAdvancePaymentIcon />, id: 1, title: '2' },
                    { description: 'Videos', icon: <ScamAdvancePaymentIcon />, id: 2, title: '3' },
                ]}
            />
        );

        const carouselControl = screen.getAllByTestId('dt_carousel_control');
        await userEvent.click(carouselControl[1]);

        expect(screen.getByText('Blog')).toBeInTheDocument();
    });
});
