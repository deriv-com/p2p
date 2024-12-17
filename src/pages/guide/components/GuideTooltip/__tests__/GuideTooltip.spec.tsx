import { render, screen } from '@testing-library/react';
import GuideTooltip from '../GuideTooltip';

jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useIsAdvertiser: jest.fn().mockReturnValue(true),
}));

describe('GuideTooltip', () => {
    it('should render the GuideTooltip component', () => {
        render(<GuideTooltip />);

        expect(screen.getByTestId('dt_guide_tooltip_icon')).toBeInTheDocument();
        expect(
            screen.getByText('Learn how to create buy/sell ads and understand the safety guidelines on Deriv P2P.')
        ).toBeInTheDocument();
    });
});
