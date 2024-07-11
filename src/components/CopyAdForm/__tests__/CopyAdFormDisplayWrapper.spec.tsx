import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import CopyAdFormDisplayWrapper from '../CopyAdFormDisplayWrapper';

const mockProps = {
    isModalOpen: true,
    isValid: true,
    onClickCancel: jest.fn(),
    onSubmit: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('CopyAdFormDisplayWrapper', () => {
    it('should render the modal with header for desktop view', () => {
        render(<CopyAdFormDisplayWrapper {...mockProps} />);
        expect(screen.getByText('Create a similar ad')).toBeInTheDocument();
    });
    it('should render the full page mobile wrapper for mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<CopyAdFormDisplayWrapper {...mockProps} />);
        expect(screen.getByTestId('dt_full_page_mobile_wrapper')).toBeInTheDocument();
        expect(screen.queryByText('Create a similar ad')).not.toBeInTheDocument();
    });
});
