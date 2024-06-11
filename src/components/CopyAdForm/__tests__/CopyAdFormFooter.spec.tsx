import { render, screen } from '@testing-library/react';
import CopyAdFormFooter from '../CopyAdFormFooter';

const mockProps = {
    isValid: true,
    onClickCancel: jest.fn(),
    onSubmit: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('CopyAdFormFooter', () => {
    it('should render the footer', () => {
        render(<CopyAdFormFooter {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create ad' })).toBeInTheDocument();
    });
    it('should handle the onClickCancel event', () => {
        render(<CopyAdFormFooter {...mockProps} />);
        screen.getByRole('button', { name: 'Cancel' }).click();
        expect(mockProps.onClickCancel).toHaveBeenCalledTimes(1);
    });
    it('should handle the onSubmit event', () => {
        render(<CopyAdFormFooter {...mockProps} />);
        screen.getByRole('button', { name: 'Create ad' }).click();
        expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
    });
    it('should disable the submit button when isValid is false', () => {
        render(<CopyAdFormFooter {...mockProps} isValid={false} />);
        expect(screen.getByRole('button', { name: 'Create ad' })).toBeDisabled();
    });
});
