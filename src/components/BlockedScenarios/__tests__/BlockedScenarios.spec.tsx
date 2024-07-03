import { render, screen } from '@testing-library/react';
import BlockedScenarios from '../BlockedScenarios';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isDesktop: true }),
}));

describe('BlockedScenarios', () => {
    it('should render the correct message for demo account', () => {
        render(<BlockedScenarios type='demo' />);
        expect(screen.getByText('You are using a demo account')).toBeVisible();
    });

    it('should render the correct message for non-USD account', () => {
        render(<BlockedScenarios type='nonUSD' />);
        expect(screen.getByText('You have no Real USD account')).toBeVisible();
    });

    it('should render the correct message for crypto account', () => {
        render(<BlockedScenarios type='crypto' />);
        expect(screen.getByText('Crypto is not supported for Deriv P2P!')).toBeVisible();
    });
});
