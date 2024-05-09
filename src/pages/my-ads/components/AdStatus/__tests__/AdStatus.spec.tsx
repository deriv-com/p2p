import { render, screen } from '@testing-library/react';
import AdStatus from '../AdStatus';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

describe('AdStatus', () => {
    it('should render the component as expected with Inactive as default', () => {
        render(<AdStatus />);
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
    it('should render active when isActive is true', () => {
        render(<AdStatus isActive={true} />);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });
});
