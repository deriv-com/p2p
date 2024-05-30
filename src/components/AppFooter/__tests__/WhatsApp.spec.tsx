import { WHATSAPP } from '@/constants';
import { render, screen } from '@testing-library/react';
import WhatsApp from '../WhatsApp';

describe('WhatsApp component', () => {
    it('renders the WhatsApp link with icon and tooltip', () => {
        render(<WhatsApp />);

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', WHATSAPP);
        expect(link).toHaveAttribute('target', '_blank');

        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
