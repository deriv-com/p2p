import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { GUIDE_URL } from '@/constants';
import { getCurrentRoute } from '@/utils';
import { LabelPairedBookCircleQuestionLgRegularIcon, StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, Tooltip } from '@deriv-com/ui';
import { LocalStorageUtils } from '@deriv-com/utils';
import './GuideTooltip.scss';

const GuideTooltip = () => {
    const history = useHistory();
    const ref = useRef<HTMLElement>(null);
    const [isGuideVisible, setIsGuideVisible] = useState<boolean>(
        LocalStorageUtils.getValue('should_show_p2p_guide') ?? true
    );
    const currentRoute = getCurrentRoute();

    const onGetStarted = () => {
        setIsGuideVisible(false);
        history.push(GUIDE_URL);
    };

    const triggerMouseOver = () => {
        if (ref.current) {
            const event = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            ref.current?.dispatchEvent(event);
        }
    };

    useEffect(() => {
        LocalStorageUtils.setValue<boolean>('should_show_p2p_guide', false);
        triggerMouseOver();
    }, []);

    return isGuideVisible ? (
        <div className='guide-tooltip'>
            <div className='guide-tooltip__overlay' />
            <Tooltip
                ref={ref}
                tooltipContainerClassName='guide-tooltip__content'
                tooltipContent={
                    <div>
                        <div className='flex align-center justify-between'>
                            <Text as='div' weight='bold'>
                                <Localize i18n_default_text='Deriv P2P Guide' />
                            </Text>
                            <StandaloneXmarkBoldIcon
                                className='guide-tooltip__content__close-btn'
                                iconSize='sm'
                                onClick={() => {
                                    setIsGuideVisible(false);
                                }}
                            />
                        </div>
                        <Text as='div' className='mt-[1rem]'>
                            <Localize i18n_default_text='Learn how to create buy/sell ads and understand the safety guidelines on Deriv P2P.' />
                        </Text>
                        <Button
                            className='mt-[1.6rem] guide-tooltip__content__get-started-btn'
                            color='black'
                            onClick={onGetStarted}
                            rounded='md'
                        >
                            <Localize i18n_default_text='Get Started' />
                        </Button>
                    </div>
                }
                tooltipOffset={12}
                tooltipPosition='bottom-end'
            >
                <LabelPairedBookCircleQuestionLgRegularIcon
                    className='guide-tooltip__content__icon guide-tooltip__content__icon--disabled'
                    data-testid='dt_guide_tooltip_icon'
                    onClick={() => history.push(GUIDE_URL, { from: currentRoute || 'buy-sell' })}
                />
            </Tooltip>
        </div>
    ) : (
        <LabelPairedBookCircleQuestionLgRegularIcon
            className='guide-tooltip__content__icon'
            data-testid='dt_guide_tooltip_icon'
            onClick={() => history.push(GUIDE_URL, { from: currentRoute || 'buy-sell' })}
        />
    );
};

export default GuideTooltip;
