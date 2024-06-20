import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsConfirmModal from '../OrderDetailsConfirmModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

jest.mock('@/providers/OrderDetailsProvider', () => ({
    useOrderDetails: jest.fn().mockReturnValue({
        orderDetails: {
            displayPaymentAmount: '0.10',
            local_currency: 'INR',
            otherUserDetails: { name: 'John Doe' },
        },
    }),
}));

const mockProps = {
    isModalOpen: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    onRequestClose: jest.fn(),
    sendFile: jest.fn(),
};

describe('<OrderDetailsConfirmModal />', () => {
    it('should render the modal’s default screen', () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        expect(screen.getByText('Payment confirmation')).toBeInTheDocument();
        expect(
            screen.getByText(
                /Please make sure that you’ve paid 0.10 INR to client John Doe, and upload the receipt as proof of your payment/
            )
        ).toBeInTheDocument();
        expect(screen.getByText('We accept JPG, PDF, or PNG (up to 5MB).')).toBeInTheDocument();
        expect(
            screen.getByText('Sending forged documents will result in an immediate and permanent ban.')
        ).toBeInTheDocument();
        expect(screen.getByText('Upload receipt here')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
    });

    it('should handle accepted files', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;

        await userEvent.upload(fileInput, file);

        await waitFor(() => {
            if (fileInput.files) {
                expect(fileInput.files[0]).toBe(file);
                expect(fileInput.files).toHaveLength(1);
            }
        });

        expect(screen.getByText('test.png')).toBeInTheDocument();
    });

    it('should show error message if file is not supported', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
        const fileInput = screen.getByTestId('dt_file_upload_input');

        const fileList = {
            0: file,
            item: () => file,
            length: 1,
        };

        Object.defineProperty(fileInput, 'files', {
            value: fileList,
        });

        fireEvent.change(fileInput);

        await waitFor(() => {
            expect(screen.getByText('The file you uploaded is not supported. Upload another.')).toBeInTheDocument();
        });
    });

    it('should show error message if file is over 5MB', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const blob = new Blob([new Array(6 * 1024 * 1024).join('a')], { type: 'image/png' });
        const file = new File([blob], 'test.png');
        await userEvent.upload(screen.getByTestId('dt_file_upload_input'), file);

        expect(screen.getByText('Cannot upload a file over 5MB')).toBeInTheDocument();
    });

    it('should remove file when close icon is clicked', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('dt_file_upload_input');

        await userEvent.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText('test.png')).toBeInTheDocument();
        });

        const closeIcon = screen.getByTestId('dt_remove_file_icon');

        await userEvent.click(closeIcon);

        await waitFor(() => {
            expect(screen.queryByText('test.png')).not.toBeInTheDocument();
        });
    });

    it('should handle confirm button click when file is uploaded', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;

        await userEvent.upload(fileInput, file);

        const button = screen.getByRole('button', { name: 'Confirm' });
        await userEvent.click(button);

        expect(mockProps.onConfirm).toHaveBeenCalled();
    });

    it('should handle goback click', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const button = screen.getByRole('button', { name: 'Go Back' });
        await userEvent.click(button);

        expect(mockProps.onCancel).toHaveBeenCalled();
    });

    it('should disable the confirm button if no file is uploaded', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const button = screen.getByRole('button', { name: 'Confirm' });
        expect(button).toBeDisabled();
    });

    it('should disable the confirm button if file is not supported', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const blob = new Blob([new Array(6 * 1024 * 1024).join('a')], { type: 'image/png' });
        const file = new File([blob], 'test.png');
        await userEvent.upload(screen.getByTestId('dt_file_upload_input'), file);

        const button = screen.getByRole('button', { name: 'Confirm' });
        expect(button).toBeDisabled();
    });
});
