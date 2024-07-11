import { PropsWithChildren } from 'react';
import { CSSTransition } from 'react-transition-group';
import { TTextColors } from 'types';
import { Text, useDevice } from '@deriv-com/ui';
import './FadeInMessage.scss';

type TFadeInMessage = {
    color?: TTextColors;
    isVisible: boolean;
    key?: string;
    noText?: boolean;
    timeout: number;
};

const FadeInMessage = ({ children, color, isVisible, key, noText, timeout }: PropsWithChildren<TFadeInMessage>) => {
    const { isDesktop } = useDevice();

    return (
        <CSSTransition
            appear
            classNames={{
                appear: 'fade-in-message--enter',
                enter: 'fade-in-message--enter',
                enterActive: 'fade-in-message--enter-active',
                enterDone: 'fade-in-message--enter-done',
                exit: 'fade-in-message--exit',
                exitActive: 'fade-in-message--exit-active',
            }}
            in={isVisible}
            key={key}
            timeout={timeout}
            unmountOnExit
        >
            {noText ? (
                <div className='fade-in-message'>{children}</div>
            ) : (
                <Text
                    align='center'
                    className='fade-in-message'
                    color={color || 'general'}
                    size={isDesktop ? 'xs' : 'sm'}
                >
                    {children}
                </Text>
            )}
        </CSSTransition>
    );
};

export default FadeInMessage;
