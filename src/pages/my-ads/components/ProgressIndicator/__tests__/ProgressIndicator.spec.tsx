import { render, screen } from '@testing-library/react';
import ProgressIndicator from '../ProgressIndicator';

const mockProps = {
    total: 2,
    value: 1,
};

describe('ProgressIndicator', () => {
    it('should render the component as expected', () => {
        render(<ProgressIndicator {...mockProps} />);
        expect(screen.getByTestId('dt_progress_indicator')).toBeInTheDocument();
    });
});
