import { useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { FileUploaderComponent } from '@/components/FileUploaderComponent';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { getErrorMessage, maxPotFileSize, TFile } from '@/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, InlineMessage, Modal, Text, useDevice } from '@deriv-com/ui';
import './OrderDetailsConfirmModal.scss';

type TOrderDetailsConfirmModalProps = {
    isModalOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    onRequestClose: () => void;
    sendFile: (file: File) => void;
};

type TDocumentFile = {
    errorMessage: string | null;
    files: File[];
};

const OrderDetailsConfirmModal = ({
    isModalOpen,
    onCancel,
    onConfirm,
    onRequestClose,
    sendFile,
}: TOrderDetailsConfirmModalProps) => {
    const { localize } = useTranslations();
    const [documentFile, setDocumentFile] = useState<TDocumentFile>({ errorMessage: null, files: [] });
    const { orderDetails } = useOrderDetails();
    const { displayPaymentAmount, local_currency: localCurrency, otherUserDetails } = orderDetails ?? {};
    const { name } = otherUserDetails ?? {};
    const { isDesktop } = useDevice();
    const buttonTextSize = isDesktop ? 'sm' : 'md';

    const handleAcceptedFiles = (files: File[]) => {
        if (files.length > 0) {
            setDocumentFile({ errorMessage: null, files });
        }
    };

    const removeFile = () => {
        setDocumentFile({ errorMessage: null, files: [] });
    };

    const handleRejectedFiles = (files: FileRejection[]) => {
        setDocumentFile({
            errorMessage: getErrorMessage(files as unknown as TFile[]),
            files: files as unknown as TFile[],
        });
    };

    return (
        <Modal
            ariaHideApp={false}
            className='order-details-confirm-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <Modal.Header
                className='border-none lg:py-14 lg:px-[2.4rem] py-4 px-[1.6rem]'
                onRequestClose={onRequestClose}
            >
                <Text size='md' weight='bold'>
                    <Localize i18n_default_text='Payment confirmation' />
                </Text>
            </Modal.Header>
            <Modal.Body className='flex flex-col lg:px-[2.4rem] px-[1.6rem]'>
                <Text data-testid='dt_confirmation_text' size='sm'>
                    <Localize
                        i18n_default_text='Please make sure that you’ve paid {{displayPaymentAmount}} {{localCurrency}} to client {{name}}, and upload the receipt as proof of your payment'
                        values={{ displayPaymentAmount, localCurrency, name }}
                    />
                </Text>
                <Text
                    className='pt-[0.8rem] pb-[2.4rem]'
                    color='less-prominent'
                    data-testid='dt_file_upload_criteria_text'
                    size='sm'
                >
                    <Localize i18n_default_text='We accept JPG, PDF, or PNG (up to 5MB).' />
                </Text>
                <InlineMessage className='mb-4' variant='warning'>
                    <Text data-testid='dt_disclaimer_warning_text' size={isDesktop ? '2xs' : 'xs'}>
                        <Localize i18n_default_text='Sending forged documents will result in an immediate and permanent ban.' />
                    </Text>
                </InlineMessage>
                <FileUploaderComponent
                    accept={{
                        'application/pdf': ['.pdf'],
                        'image/jpeg': ['.jpeg'],
                        'image/jpg': ['.jpg'],
                        'image/png': ['.png'],
                    }}
                    hoverMessage={localize('Upload receipt here')}
                    maxSize={maxPotFileSize}
                    onClickClose={removeFile}
                    onDropAccepted={handleAcceptedFiles}
                    onDropRejected={handleRejectedFiles}
                    uploadedMessage={localize('Upload receipt here')}
                    validationErrorMessage={documentFile.errorMessage}
                    value={documentFile.files}
                />
            </Modal.Body>
            <Modal.Footer className='gap-4 border-none lg:p-[2.4rem] p-[1.6rem]'>
                <Button className='border-2' color='black' onClick={onCancel} size='lg' variant='outlined'>
                    <Text lineHeight='6xl' size={buttonTextSize} weight='bold'>
                        <Localize i18n_default_text='Go Back' />
                    </Text>
                </Button>
                <Button
                    disabled={!documentFile.files.length || !!documentFile.errorMessage}
                    onClick={() => {
                        sendFile(documentFile.files[0]);
                        onConfirm();
                    }}
                    size='lg'
                >
                    <Text lineHeight='6xl' size={buttonTextSize} weight='bold'>
                        <Localize i18n_default_text='Confirm' />
                    </Text>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsConfirmModal;
