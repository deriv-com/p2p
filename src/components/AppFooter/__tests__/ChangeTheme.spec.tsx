import { render, screen } from '@testing-library/react';
import ChangeTheme from '../ChangeTheme';

describe('ChangeTheme component', () => {
    it('renders correctly with the tooltip content', () => {
        render(<ChangeTheme />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
