import { api } from '@/hooks';
import { render, screen } from '@testing-library/react';
import TemporarilyBarredHint from '../TemporarilyBarredHint';

jest.mock('@/hooks', () => ({
    api: {
        advertiser: {
            useGetInfo: jest.fn().mockReturnValue({ data: {} }),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

const mockUseGetInfo = api.advertiser.useGetInfo as jest.MockedFunction<typeof api.advertiser.useGetInfo>;

describe('<TemporarilyBarredHint />', () => {
    it('should render null if blocked_until is undefined', () => {
        render(<TemporarilyBarredHint />);

        expect(
            screen.queryByText(
                /You’ve been temporarily barred from using our services due to multiple cancellation attempts./i
            )
        ).not.toBeInTheDocument();
    });

    it('should render the InlineMessage component if blocked_until is defined', () => {
        (mockUseGetInfo as jest.Mock).mockReturnValue({ data: { blocked_until: 123456890 } });

        render(<TemporarilyBarredHint />);

        expect(
            screen.getByText(
                /You’ve been temporarily barred from using our services due to multiple cancellation attempts./i
            )
        ).toBeInTheDocument();
    });
});
