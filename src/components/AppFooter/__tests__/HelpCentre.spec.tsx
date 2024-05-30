import { HELP_CENTRE } from '@/constants';
import { render, screen } from '@testing-library/react';
import HelpCentre from '../HelpCentre';

describe('HelpCentre component', () => {
    it('renders the help centre link with icon', () => {
        render(<HelpCentre />);

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', HELP_CENTRE);
        expect(link).toHaveAttribute('target', '_blank');

        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
