import { useIsAdvertiserBarred } from '@/hooks';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import MyAdsDisplayWrapper from '../MyAdsDisplayWrapper';

const mockProps = {
    isDisabled: false,
    isPaused: false,
    onClickToggle: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
    }),
}));

jest.mock('@/hooks', () => ({
    useIsAdvertiserBarred: jest.fn().mockReturnValue(false),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('MyAdsDisplayWrapper', () => {
    it('should render the component as expected', () => {
        render(
            <MyAdsDisplayWrapper {...mockProps}>
                <div>children</div>
            </MyAdsDisplayWrapper>
        );
        expect(screen.queryByTestId('dt_full_page_mobile_wrapper')).not.toBeInTheDocument();
    });
    it('should render the content inside full page mobile wrapper in mobile view', () => {
        mockUseDevice.mockReturnValue({
            isMobile: true,
        });
        render(
            <MyAdsDisplayWrapper {...mockProps}>
                <div>children</div>
            </MyAdsDisplayWrapper>
        );
        expect(screen.getByTestId('dt_full_page_mobile_wrapper')).toBeInTheDocument();
    });
    it('should render the create ad button as disabled when advertiser is temp barred from creating ads', () => {
        (useIsAdvertiserBarred as jest.Mock).mockReturnValue(true);
        render(
            <MyAdsDisplayWrapper {...mockProps}>
                <div>children</div>
            </MyAdsDisplayWrapper>
        );
        expect(screen.getByRole('button', { name: 'Create new ad' })).toBeDisabled();
    });
    it('should render the create ad button as disabled when advertiser has not verified his phone', () => {
        render(
            <MyAdsDisplayWrapper {...mockProps} isDisabled>
                <div>children</div>
            </MyAdsDisplayWrapper>
        );
        expect(screen.getByRole('button', { name: 'Create new ad' })).toBeDisabled();
    });
});
