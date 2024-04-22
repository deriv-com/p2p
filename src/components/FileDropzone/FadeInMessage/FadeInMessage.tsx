import { PropsWithChildren } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Text, useDevice } from '@deriv-com/ui';

import { TTextColors } from '@/utils';

import './FadeInMessage.scss';

type TFadeInMessage = {
    color?: TTextColors;
    isVisible: boolean;
    key?: string;
    noText?: boolean;
    timeout: number;
};

const FadeInMessage = ({ children, color, isVisible, key, noText, timeout }: PropsWithChildren<TFadeInMessage>) => {
    const { isMobile } = useDevice();

    return (
        <CSSTransition
            appear
            classNames={{
                appear: 'p2p-fade-in-message--enter',
                enter: 'p2p-fade-in-message--enter',
                enterActive: 'p2p-fade-in-message--enter-active',
                enterDone: 'p2p-fade-in-message--enter-done',
                exit: 'p2p-fade-in-message--exit',
                exitActive: 'p2p-fade-in-message--exit-active',
            }}
            in={isVisible}
            key={key}
            timeout={timeout}
            unmountOnExit
        >
            {noText ? (
                <div className='p2p-fade-in-message'>{children}</div>
            ) : (
                <Text
                    align='center'
                    className='p2p-fade-in-message'
                    color={color || 'general'}
                    size={isMobile ? 'sm' : 'xs'}
                >
                    {children}
                </Text>
            )}
        </CSSTransition>
    );
};

export default FadeInMessage;
