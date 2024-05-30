import { RESPONSIBLE } from '@/constants';
import { render, screen } from '@testing-library/react';
import ResponsibleTrading from '../ResponsibleTrading';

describe('ResponsibleTrading component', () => {
    it('renders the responsible trading link with icon and tooltip', () => {
        render(<ResponsibleTrading />);

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', RESPONSIBLE);
        expect(link).toHaveAttribute('target', '_blank');

        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
