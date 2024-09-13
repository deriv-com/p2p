import { render, screen } from '@testing-library/react';
import UserAvatar from '../UserAvatar';

jest.mock('@/hooks', () => ({
    useIsRtl: () => false,
}));

describe('UserAvatar', () => {
    it('should render the component correctly', () => {
        render(<UserAvatar nickname='Jane Doe' />);
        expect(screen.getByTestId('dt_user_avatar')).toBeInTheDocument();
    });
    it('should show the nickname correctly for first name', () => {
        render(<UserAvatar nickname='Jane' />);
        expect(screen.getByText('JA')).toBeInTheDocument();
    });
    it('should show the username nickname correctly for full name', () => {
        render(<UserAvatar nickname='Jane Doe' />);
        expect(screen.getByText('JA')).toBeInTheDocument();
    });
});
