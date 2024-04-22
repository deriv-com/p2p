import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { LabelPairedArrowLeftLgBoldIcon } from '@deriv/quill-icons';
import './FullPageMobileWrapper.scss';

type TFullPageMobileWrapperProps = {
    className?: string;
    onBack?: () => void;
    renderFooter?: () => React.ReactNode;
    renderHeader?: () => React.ReactNode;
    shouldFixedFooter?: boolean;
    shouldShowBackIcon?: boolean;
};

const FullPageMobileWrapper = ({
    children,
    className = '',
    onBack = () => undefined,
    renderFooter,
    renderHeader,
    shouldFixedFooter = true,
    shouldShowBackIcon = true,
}: PropsWithChildren<TFullPageMobileWrapperProps>) => {
    return (
        <div
            className={clsx('p2p-mobile-wrapper', className, {
                'p2p-mobile-wrapper--fixed-footer': shouldFixedFooter,
                'p2p-mobile-wrapper--no-footer': !renderFooter,
                'p2p-mobile-wrapper--no-header': !renderHeader,
                'p2p-mobile-wrapper--no-header-fixed-footer': !renderHeader && shouldFixedFooter,
            })}
            data-testid='dt_full_page_mobile_wrapper'
        >
            {renderHeader && (
                <div className='p2p-mobile-wrapper__header'>
                    {shouldShowBackIcon && (
                        <LabelPairedArrowLeftLgBoldIcon
                            data-testid='dt_mobile_wrapper_button'
                            onClick={onBack}
                        />
                    )}
                    {renderHeader()}
                </div>
            )}
            <div className='p2p-mobile-wrapper__body'>{children}</div>
            {renderFooter && <div className={clsx('p2p-mobile-wrapper__footer')}>{renderFooter()}</div>}
        </div>
    );
};

export default FullPageMobileWrapper;
