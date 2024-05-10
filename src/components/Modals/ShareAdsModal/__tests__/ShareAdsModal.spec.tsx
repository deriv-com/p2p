import html2canvas from 'html2canvas';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareAdsModal from '../ShareAdsModal';

const mockProps = {
    id: 'id',
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

const mockUseGet = {
    data: {
        account_currency: 'USD',
        advertiser_details: {
            id: 'id',
        },
        local_currency: 'USD',
        rate_display: '1',
        rate_type: 'fixed',
        type: 'buy',
    },
    isLoading: false,
};

jest.mock('@/hooks', () => ({
    api: {
        advert: {
            useGet: jest.fn(() => mockUseGet),
        },
    },
}));

jest.mock('qrcode.react', () => ({ QRCodeSVG: () => <div>QR code</div> }));

jest.mock('html2canvas', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
        toDataURL: jest.fn(),
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isDesktop: true,
        isMobile: false,
    }),
}));

const mockCopyFn = jest.fn();
jest.mock('@/hooks/custom-hooks', () => ({
    ...jest.requireActual('@/hooks/custom-hooks'),
    useCopyToClipboard: jest.fn(() => [true, mockCopyFn, jest.fn()]),
}));

const mockUseDevice = useDevice as jest.Mock;

describe('ShareAdsModal', () => {
    it('should render the modal as expected', () => {
        render(<ShareAdsModal {...mockProps} />);
        expect(screen.getByText('Share this ad')).toBeInTheDocument();
        expect(screen.getByText('Promote your ad by sharing the QR code and link.')).toBeInTheDocument();
    });
    it('should handle onclick when clicking on Share link', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
        });
        const mockShare = jest.fn().mockResolvedValue(true);
        globalThis.navigator.share = mockShare;
        render(<ShareAdsModal {...mockProps} />);
        const shareLinkButton = screen.getByRole('button', { name: 'Share link' });
        await userEvent.click(shareLinkButton);
        expect(mockShare).toBeCalled();
    });

    it('should call onCopy function when clicking on copy icon', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
        });

        render(<ShareAdsModal {...mockProps} />);

        const copyButton = screen.getByRole('button', { name: 'Copy link' });
        await userEvent.click(copyButton);

        expect(mockCopyFn).toHaveBeenCalledWith(
            `${window.location.href}advertiser/${mockUseGet.data.advertiser_details.id}?advert_id=${mockProps.id}&currency=${mockUseGet.data.local_currency}`
        );
    });
    it('should call html2canvas function when clicking on Download this QR code button', async () => {
        mockUseDevice.mockReturnValue({
            isDesktop: false,
            isMobile: true,
        });

        render(<ShareAdsModal {...mockProps} />);

        const downloadButton = screen.getByRole('button', { name: 'Download this QR code' });
        await userEvent.click(downloadButton);

        await waitFor(() => expect(html2canvas).toBeCalled());
    });
});
