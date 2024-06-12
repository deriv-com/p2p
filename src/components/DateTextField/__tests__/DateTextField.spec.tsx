import { render, screen } from '@testing-library/react';
import DateTextField from '../DateTextField';

const mockProps = {
    label: 'Date from',
    value: '',
};

describe('DateTextField', () => {
    it('should render DateTextField', () => {
        render(<DateTextField {...mockProps} />);
        expect(screen.getByText('Date from')).toBeInTheDocument();
    });
    it('should render DateTextField with value', () => {
        render(<DateTextField {...mockProps} value='2024-06-01' />);
        expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
    });
    it('should render DateTextField with leftPlaceholder', () => {
        render(<DateTextField {...mockProps} />);
        expect(screen.getByTestId('dt_calendar_icon_left')).toBeInTheDocument();
    });
    it('should render DateTextField with rightplaceholder when alignedRight is true', () => {
        render(<DateTextField {...mockProps} alignedRight />);
        expect(screen.getByTestId('dt_calendar_icon_right')).toBeInTheDocument();
    });
    it('should render DateTextField without label when value is present', () => {
        render(<DateTextField {...mockProps} label='' value='2024-06-01' />);
        expect(screen.queryByText('Date from')).not.toBeInTheDocument();
    });
});
