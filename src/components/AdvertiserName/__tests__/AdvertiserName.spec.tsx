import { render, screen } from '@testing-library/react';
import AdvertiserName from '../AdvertiserName';

const mockProps = {
    advertiserStats: {
        fullName: 'Jane Doe',
        name: 'Jane',
        should_show_name: true,
    },
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('AdvertiserName', () => {
    it('should render full name', () => {
        render(<AdvertiserName {...mockProps} />);
        expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    });
});
