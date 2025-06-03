import { render, screen } from '@testing-library/react';
import AwarenessBanner from '../AwarenessBanner';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({ data: undefined })),
        },
    },
}));

describe('PNVBanner', () => {
    it('should render the proper message', async () => {
        render(<AwarenessBanner />);

        expect(
            screen.getByText(
                /Never share login details or verification codes. Check URLs and contact us only via live chat./i
            )
        ).toBeInTheDocument();
    });
});
