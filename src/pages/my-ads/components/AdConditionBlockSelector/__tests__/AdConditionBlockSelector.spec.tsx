import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdConditionBlockSelector from '../AdConditionBlockSelector';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('@/constants', () => ({
    ...jest.requireActual('@/constants'),
    getAdConditionContent: () => ({
        completionRates: {
            description: 'description',
            options: [
                {
                    label: 'label',
                    value: 1,
                },
            ],
            title: 'title',
        },
    }),
}));
describe('AdConditionBlockSelector', () => {
    it('should render the component as expected', () => {
        render(<AdConditionBlockSelector onClick={jest.fn()} type='completionRates' />);
        expect(screen.getByText('title')).toBeInTheDocument();
    });
    it('should handle the onClick for AdConditionBlockElement', async () => {
        const mockOnClick = jest.fn();
        render(<AdConditionBlockSelector onClick={mockOnClick} type='completionRates' />);
        await userEvent.click(screen.getByText('label'));
        expect(mockOnClick).toHaveBeenCalledWith(1);
    });
});
