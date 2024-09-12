import { cloneElement, ReactElement, ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Portal, Tooltip } from '@chakra-ui/react';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { LocalStorageUtils } from '@deriv-com/utils';
import './OnboardingTooltip.scss';

type TOnboardingTooltipProps = {
    buttonText: ReactNode;
    className?: string;
    description: ReactNode;
    disabledClassName?: string;
    icon: ReactElement;
    localStorageItemName: string;
    onClick?: () => void;
    title: ReactNode;
};

const OnboardingTooltip = ({
    buttonText,
    className = '',
    description,
    disabledClassName = '',
    icon,
    localStorageItemName,
    onClick,
    title,
}: TOnboardingTooltipProps) => {
    const [isOnboardingTooltipVisible, setIsOnboardingTooltipVisible] = useState<boolean>(
        // @ts-expect-error - localStorageItemName is a string
        LocalStorageUtils.getValue(localStorageItemName) ?? true
    );

    const onClickButton = () => {
        setIsOnboardingTooltipVisible(false);
        onClick?.();
    };

    const modifiedIcon = cloneElement(icon, {
        className: clsx('onboarding-tooltip__icon', className, {
            [disabledClassName]: isOnboardingTooltipVisible,
            'onboarding-tooltip__icon--disabled': isOnboardingTooltipVisible,
        }),
    });

    useEffect(() => {
        // @ts-expect-error - localStorageItemName is a string
        LocalStorageUtils.setValue<boolean>(localStorageItemName, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isOnboardingTooltipVisible ? (
        <div>
            <Portal>
                <div className='onboarding-tooltip__overlay' />
            </Portal>
            <Tooltip
                arrowSize={8}
                bg='#fff'
                className='onboarding-tooltip'
                hasArrow
                isOpen
                label={
                    <div>
                        <div className='flex align-center justify-between'>
                            <Text as='div' size='sm' weight='bold'>
                                {title}
                            </Text>
                            <StandaloneXmarkBoldIcon
                                className='onboarding-tooltip__close-btn'
                                data-testid='dt_onboarding_tooltip_close_btn'
                                iconSize='sm'
                                onClick={() => {
                                    setIsOnboardingTooltipVisible(false);
                                }}
                            />
                        </div>
                        <Text as='div' className='mt-2 lg:w-11/12 w-full' size='sm'>
                            {description}
                        </Text>
                        <Button
                            className='mt-[1.6rem] onboarding-tooltip__get-started-btn'
                            color='black'
                            onClick={onClickButton}
                            rounded='md'
                        >
                            {buttonText}
                        </Button>
                    </div>
                }
                placement='bottom-end'
            >
                {modifiedIcon}
            </Tooltip>
        </div>
    ) : (
        modifiedIcon
    );
};

export default OnboardingTooltip;
