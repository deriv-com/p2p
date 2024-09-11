import { cloneElement, ReactElement, ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { GUIDE_URL } from '@/constants';
import { Portal, Tooltip } from '@chakra-ui/react';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { LocalStorageUtils } from '@deriv-com/utils';
import './OnboardingTooltip.scss';

type TOnboardingTooltipProps = {
    buttonText: ReactNode;
    className: string;
    description: ReactNode;
    icon: ReactElement;
    localStorageItemName: string;
    onClickIcon: () => void;
    title: ReactNode;
};

const OnboardingTooltip = ({
    buttonText,
    className,
    description,
    icon,
    localStorageItemName,
    onClickIcon,
    title,
}: TOnboardingTooltipProps) => {
    const history = useHistory();
    const [isOnboardingTooltipVisible, setIsOnboardingTooltipVisible] = useState<boolean>(
        // @ts-expect-error - localStorageItemName is a string
        LocalStorageUtils.getValue(localStorageItemName) ?? true
    );

    const onGetStarted = () => {
        setIsOnboardingTooltipVisible(false);
        history.push(GUIDE_URL);
    };

    const modifiedIcon = cloneElement(icon, {
        className: clsx(className, 'onboarding-tooltip__icon', {
            'onboarding-tooltip__icon--disabled': isOnboardingTooltipVisible,
        }),
        onClick: onClickIcon,
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
                            <Text as='div' weight='bold'>
                                {title}
                            </Text>
                            <StandaloneXmarkBoldIcon
                                className='onboarding-tooltip__close-btn'
                                iconSize='sm'
                                onClick={() => {
                                    setIsOnboardingTooltipVisible(false);
                                }}
                            />
                        </div>
                        <Text as='div' className='mt-[1rem]'>
                            {description}
                        </Text>
                        <Button
                            className='mt-[1.6rem] onboarding-tooltip__get-started-btn'
                            color='black'
                            onClick={onGetStarted}
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
