import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { api } from '@/hooks';
import { getCurrentRoute } from '@/utils';
import { Modal, useDevice } from '@deriv-com/ui';
import { FullPageMobileWrapper } from '../FullPageMobileWrapper';
import { BuySellFormFooter } from './BuySellFormFooter';
import { BuySellFormHeader } from './BuySellFormHeader';

type TBuySellFormDisplayWrapperProps = {
    accountCurrency: string;
    isBuy: boolean;
    isHidden: boolean;
    isModalOpen: boolean;
    isValid: boolean;
    onRequestClose: () => void;
    onSubmit: () => void;
};
const BuySellFormDisplayWrapper = ({
    accountCurrency,
    children,
    isBuy,
    isHidden,
    isModalOpen,
    isValid,
    onRequestClose,
    onSubmit,
}: PropsWithChildren<TBuySellFormDisplayWrapperProps>) => {
    const { isDesktop } = useDevice();
    const currentRoute = getCurrentRoute();
    const { data: accountData } = api.account.useActiveAccount();
    const isAwarenessBannerHidden = localStorage.getItem(`p2p_${accountData?.loginid}_is_awareness_banner_hidden`);

    if (!isDesktop) {
        return (
            <FullPageMobileWrapper
                className={clsx('buy-sell-form__full-page-modal', {
                    'buy-sell-form__full-page-modal--is-buy-has-banner':
                        currentRoute === 'buy-sell' &&
                        (isAwarenessBannerHidden === 'false' || isAwarenessBannerHidden === null),
                    'buy-sell-form__full-page-modal--is-buy-no-banner':
                        currentRoute === 'buy-sell' && isAwarenessBannerHidden === 'true',
                })}
                onBack={onRequestClose}
                renderHeader={() => <BuySellFormHeader currency={accountCurrency} isBuy={isBuy} />}
            >
                {children}
                <BuySellFormFooter isDisabled={!isValid} onClickCancel={onRequestClose} />
            </FullPageMobileWrapper>
        );
    }

    return (
        <Modal
            ariaHideApp={false}
            className={clsx('buy-sell-form', { 'buy-sell-form--is-buy': isBuy, hidden: isHidden })}
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={{ overlay: { background: isHidden ? 'transparent' : 'rgba(0, 0, 0, 0.72)', zIndex: 9999 } }}
        >
            <Modal.Header onRequestClose={onRequestClose}>
                <BuySellFormHeader currency={accountCurrency} isBuy={isBuy} />
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <BuySellFormFooter isDisabled={!isValid} onClickCancel={onRequestClose} onSubmit={onSubmit} />
            </Modal.Footer>
        </Modal>
    );
};

export default BuySellFormDisplayWrapper;
