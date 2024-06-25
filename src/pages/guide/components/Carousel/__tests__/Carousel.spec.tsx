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
        render(<Carousel items={[<div key={0}>1</div>, <div key={1}>2</div>]} />);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });
    it('should show the proper item on click of controls', async () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(<Carousel items={[<div key={0}>1</div>, <div key={1}>2</div>, <div key={2}>3</div>]} />);

        const carouselControl = screen.getAllByTestId('dt_carousel_control');
        await userEvent.click(carouselControl[1]);

        expect(screen.getByText('2')).toBeInTheDocument();
    });
});
