import { render, screen } from '@testing-library/react';
import Awareness from '../Awareness';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('Awareness', () => {
    it('should render the Awareness component', () => {
        render(<Awareness />);
        expect(screen.getByText('P2P awareness and precautions')).toBeInTheDocument();
        expect(screen.getByText("Don't pay upfront")).toBeInTheDocument();
        expect(screen.getByText("Confirm you've received payment")).toBeInTheDocument();
        expect(screen.getByText('Stay safe from impersonators')).toBeInTheDocument();
    });
});
