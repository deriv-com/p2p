import { DERIV_COM } from '@/constants';
import { render, screen } from '@testing-library/react';
import Deriv from '../Deriv';

describe('Deriv component', () => {
    it('renders correctly with the tooltip content', () => {
        render(<Deriv />);

        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', DERIV_COM);
        expect(linkElement).toHaveAttribute('target', '_blank');
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
