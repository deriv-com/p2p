import { PropsWithChildren } from 'react';
import { useDevice } from '@deriv-com/ui';
import { FullPageMobileWrapper } from '../FullPageMobileWrapper';
import { CopyAdFormModal } from '../Modals';
import CopyAdFormFooter from './CopyAdFormFooter';

type TCopyAdFormDisplayWrapperProps = {
    isModalOpen: boolean;
    isValid: boolean;
    onClickCancel: () => void;
    onSubmit: () => void;
};
const CopyAdFormDisplayWrapper = ({
    children,
    isModalOpen,
    isValid,
    onClickCancel,
    onSubmit,
}: PropsWithChildren<TCopyAdFormDisplayWrapperProps>) => {
    const { isDesktop } = useDevice();

    if (!isDesktop) {
        return (
            <FullPageMobileWrapper
                className='copy-ad-form__full-page-modal'
                renderFooter={() => (
                    <CopyAdFormFooter isValid={isValid} onClickCancel={onClickCancel} onSubmit={onSubmit} />
                )}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }

    return (
        <CopyAdFormModal isModalOpen={isModalOpen} isValid={isValid} onClickCancel={onClickCancel} onSubmit={onSubmit}>
            {children}
        </CopyAdFormModal>
    );
};

export default CopyAdFormDisplayWrapper;
