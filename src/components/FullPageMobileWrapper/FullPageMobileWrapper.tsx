import { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';
import { LabelPairedArrowLeftLgBoldIcon, StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import './FullPageMobileWrapper.scss';

type TFullPageMobileWrapperProps = {
    className?: string;
    onBack?: () => void;
    renderFooter?: () => ReactNode;
    renderHeader?: () => ReactNode;
    shouldFixedFooter?: boolean;
    shouldShowBackIcon?: boolean;
    shouldShowCloseIcon?: boolean;
};

const FullPageMobileWrapper = ({
    children,
    className = '',
    onBack = () => undefined,
    renderFooter,
    renderHeader,
    shouldFixedFooter = true,
    shouldShowBackIcon = true,
    shouldShowCloseIcon = false,
}: PropsWithChildren<TFullPageMobileWrapperProps>) => {
    return (
        <div
            className={clsx('mobile-wrapper', className, {
                'mobile-wrapper--fixed-footer': shouldFixedFooter,
                'mobile-wrapper--no-footer': !renderFooter,
                'mobile-wrapper--no-header': !renderHeader,
                'mobile-wrapper--no-header-fixed-footer': !renderHeader && shouldFixedFooter,
            })}
            data-testid='dt_full_page_mobile_wrapper'
        >
            {renderHeader && (
                <div className='mobile-wrapper__header'>
                    {shouldShowBackIcon && (
                        <LabelPairedArrowLeftLgBoldIcon data-testid='dt_mobile_wrapper_button' onClick={onBack} />
                    )}
                    {renderHeader()}
                    {shouldShowCloseIcon && (
                        <div className='absolute right-[1.6rem]'>
                            <StandaloneXmarkBoldIcon data-testid='dt_mobile_wrapper_button' onClick={onBack} />
                        </div>
                    )}
                </div>
            )}
            <div className='mobile-wrapper__body'>{children}</div>
            {renderFooter && <div className={clsx('mobile-wrapper__footer')}>{renderFooter()}</div>}
        </div>
    );
};

export default FullPageMobileWrapper;
