import { render, screen } from '@testing-library/react';
import CopyAdFormHeader from '../CopyAdFormHeader';

describe('CopyAdFormHeader', () => {
    it('should render the header', () => {
        render(<CopyAdFormHeader />);
        expect(screen.getByText('Create a similar ad')).toBeInTheDocument();
    });
});
