import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdConditionContentHeader from '../AdConditionContentHeader';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/constants', () => ({
    ...jest.requireActual('@/constants'),
    getAdConditionContent: () => ({
        completionRates: {
            description: 'description',
            title: 'title',
        },
    }),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('AdConditionContentHeader', () => {
    it('should render the component as expected with given type', () => {
        render(<AdConditionContentHeader type='completionRates' />);
        expect(screen.getByText('title')).toBeInTheDocument();
    });
    it('should handle clicking the tooltip icon', async () => {
        mockUseDevice.mockReturnValue({ isMobile: true });
        render(<AdConditionContentHeader type='completionRates' />);
        await userEvent.click(screen.getByTestId('dt_ad_condition_tooltip_icon'));
        const okButton = screen.getByRole('button', { name: 'OK' });
        expect(okButton).toBeInTheDocument();
        await userEvent.click(okButton);
        expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });
});
