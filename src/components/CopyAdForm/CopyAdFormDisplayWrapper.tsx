import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { getCurrentRoute } from '@/utils';
import { useDevice } from '@deriv-com/ui';
import { FullPageMobileWrapper } from '../FullPageMobileWrapper';
import { CopyAdFormModal } from '../Modals';
import CopyAdFormFooter from './CopyAdFormFooter';
import CopyAdFormHeader from './CopyAdFormHeader';

type TCopyAdFormDisplayWrapperProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};
const CopyAdFormDisplayWrapper = ({
    children,
    isModalOpen,
    onRequestClose,
}: PropsWithChildren<TCopyAdFormDisplayWrapperProps>) => {
    const { isMobile } = useDevice();
    const currentRoute = getCurrentRoute();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className={clsx('buy-sell-form__full-page-modal', {
                    'buy-sell-form__full-page-modal--is-buy': currentRoute === 'buy-sell',
                })}
                onBack={onRequestClose}
                renderFooter={() => <CopyAdFormFooter onRequestClose={onRequestClose} />}
                renderHeader={() => <CopyAdFormHeader />}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }

    return (
        <CopyAdFormModal isModalOpen={isModalOpen} onRequestClose={onRequestClose}>
            {children}
        </CopyAdFormModal>
    );
};

export default CopyAdFormDisplayWrapper;
