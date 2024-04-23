import { useCallback, useRef } from 'react';
import clsx from 'clsx';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import { TFileDropzone, truncateFileName } from '@/utils';
import { Text } from '@deriv-com/ui';
import { FadeInMessage } from './FadeInMessage';
import { PreviewSingle } from './PreviewSingle';
import './FileDropzone.scss';

const DROPZONE_TIMEOUT = 150;

// TODO: Remove this and other associated files once FileDropzone component from deriv-com/ui is completed
const FileDropzone = ({ className, noClick = false, ...props }: TFileDropzone) => {
    const {
        accept,
        errorMessage,
        filenameLimit,
        hoverMessage,
        maxSize,
        message,
        multiple,
        onDropAccepted,
        onDropRejected,
        validationErrorMessage,
        value,
    } = props;

    const RenderErrorMessage = useCallback(
        ({ open }: DropzoneRef) => {
            if (noClick && typeof message === 'function') return <>{message(open)}</>;

            return <>{message}</>;
        },
        [message, noClick]
    );

    const RenderValidationErrorMessage = useCallback(
        ({ open }: DropzoneRef) => {
            if (typeof validationErrorMessage === 'function') return <>{validationErrorMessage(open)}</>;

            return <>{validationErrorMessage}</>;
        },
        [validationErrorMessage]
    );

    const dropzoneRef = useRef(null);

    return (
        <Dropzone
            // accept prop is same as native HTML5 input accept - e.g - 'image/png'
            accept={accept}
            // set maximum size limit for file, in bytes (binary)
            maxSize={maxSize}
            // allow multiple uploads
            multiple={multiple || false}
            noClick={noClick}
            // sends back accepted files array
            onDropAccepted={onDropAccepted}
            // sends back rejected files array
            onDropRejected={onDropRejected}
        >
            {({ getInputProps, getRootProps, isDragAccept, isDragActive, isDragReject, open }) => (
                <div
                    {...getRootProps()}
                    className={clsx('file-dropzone', className, {
                        'file-dropzone--has-error': (isDragReject || !!validationErrorMessage) && !isDragAccept,
                        'file-dropzone--has-file': isDragActive || value.length > 0,
                        'file-dropzone--is-active': isDragActive,
                        'file-dropzone--is-noclick': noClick,
                    })}
                    ref={dropzoneRef}
                >
                    <input {...getInputProps()} data-testid='dt_file_upload_input' />
                    <div className='file-dropzone__content'>
                        <FadeInMessage
                            // default message when not on hover or onDrag
                            isVisible={!isDragActive && !!message && value.length < 1 && !validationErrorMessage}
                            noText={noClick}
                            timeout={DROPZONE_TIMEOUT}
                        >
                            <RenderErrorMessage open={open} />
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on hover if files are accepted onDrag
                            isVisible={isDragActive && !isDragReject}
                            timeout={DROPZONE_TIMEOUT}
                        >
                            {hoverMessage}
                        </FadeInMessage>
                        {/* Handle cases for displaying multiple files and single filenames */}
                        {multiple && value.length > 0 && !validationErrorMessage
                            ? value.map(file => (
                                  <Text
                                      align='center'
                                      className='file-dropzone__filename'
                                      key={file.name}
                                      size='2xs'
                                      weight='bold'
                                  >
                                      {filenameLimit ? truncateFileName(file, filenameLimit) : file.name}
                                  </Text>
                              ))
                            : value[0] &&
                              !isDragActive &&
                              !validationErrorMessage && <PreviewSingle dropzoneRef={dropzoneRef} {...props} />}
                        <FadeInMessage
                            // message shown if there are errors with the dragged file
                            color='error'
                            isVisible={isDragReject}
                            timeout={DROPZONE_TIMEOUT}
                        >
                            {errorMessage}
                        </FadeInMessage>
                        <FadeInMessage
                            // message shown on if there are validation errors with file uploaded
                            color='error'
                            isVisible={!!validationErrorMessage && !isDragActive}
                            timeout={DROPZONE_TIMEOUT}
                        >
                            <RenderValidationErrorMessage open={open} />
                        </FadeInMessage>
                    </div>
                </div>
            )}
        </Dropzone>
    );
};

export default FileDropzone;
