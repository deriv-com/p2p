import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GUIDE_URL } from '@/constants';
import { Portal, Tooltip } from '@chakra-ui/react';
import { LabelPairedBookCircleQuestionLgRegularIcon, StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import { LocalStorageUtils } from '@deriv-com/utils';
import './GuideTooltip.scss';

// TODO: replace this with deriv/ui
const GuideTooltip = () => {
    const history = useHistory();
    const [isGuideVisible, setIsGuideVisible] = useState<boolean | null>(
        LocalStorageUtils.getValue('should_show_p2p_guide') ?? null
    );

    const onGetStarted = () => {
        setIsGuideVisible(false);
        history.push(GUIDE_URL);
    };

    useEffect(() => {
        if (isGuideVisible === null) {
            setIsGuideVisible(true);
            LocalStorageUtils.setValue<boolean>('should_show_p2p_guide', true);
        }
    }, [isGuideVisible]);

    return isGuideVisible ? (
        <div>
            <Portal>
                <div className='guide-tooltip__overlay' />
            </Portal>
            <Tooltip
                arrowSize={8}
                bg='#fff'
                className='guide-tooltip'
                hasArrow
                isOpen
                label={
                    <div>
                        <div className='flex align-center justify-between'>
                            <Text as='div' weight='bold'>
                                <Localize i18n_default_text='Deriv P2P Guide' />
                            </Text>
                            <StandaloneXmarkBoldIcon
                                className='guide-tooltip__close-btn'
                                iconSize='sm'
                                onClick={() => setIsGuideVisible(false)}
                            />
                        </div>
                        <Text as='div' className='mt-[1rem]'>
                            <Localize i18n_default_text='Learn how to create buy/sell ads and understand the safety guidelines on Deriv P2P.' />
                        </Text>
                        <Button
                            className='mt-[1.6rem] guide-tooltip__get-started-btn'
                            color='black'
                            onClick={onGetStarted}
                            rounded='md'
                        >
                            <Localize i18n_default_text='Get Started' />
                        </Button>
                    </div>
                }
                placement='bottom-end'
            >
                <LabelPairedBookCircleQuestionLgRegularIcon
                    className='guide-tooltip__icon guide-tooltip__icon--disabled'
                    data-testid='dt_guide_tooltip_icon'
                    onClick={() => history.push(GUIDE_URL)}
                />
            </Tooltip>
        </div>
    ) : (
        <LabelPairedBookCircleQuestionLgRegularIcon
            className='guide-tooltip__icon'
            data-testid='dt_guide_tooltip_icon'
            onClick={() => history.push(GUIDE_URL)}
        />
    );
};

export default GuideTooltip;
