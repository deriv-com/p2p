import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { OnboardingTooltip } from '@/components';
import { GUIDE_URL } from '@/constants';
import { useIsAdvertiser } from '@/hooks/custom-hooks';
import { getCurrentRoute } from '@/utils';
import { LabelPairedBookCircleQuestionLgRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { LocalStorageConstants } from '@deriv-com/utils';
import './GuideTooltip.scss';

const GuideTooltip = () => {
    const history = useHistory();
    const currentRoute = getCurrentRoute();
    const isAdvertiser = useIsAdvertiser();

    return (
        <OnboardingTooltip
            buttonText={<Localize i18n_default_text='Get Started' />}
            className={clsx('guide-tooltip__icon', {
                'guide-tooltip__icon--is-buy-sell': currentRoute === 'buy-sell',
                'guide-tooltip__icon--not-advertiser': !isAdvertiser,
            })}
            description={
                <Localize i18n_default_text='Learn how to create buy/sell ads and understand the safety guidelines on Deriv P2P.' />
            }
            icon={
                <LabelPairedBookCircleQuestionLgRegularIcon
                    data-testid='dt_guide_tooltip_icon'
                    onClick={() => history.push(GUIDE_URL, { from: currentRoute || 'buy-sell' })}
                />
            }
            localStorageItemName={LocalStorageConstants.p2pShowGuide}
            onClick={() => history.push(GUIDE_URL)}
            title={<Localize i18n_default_text='Deriv P2P Guide' />}
        />
    );
};

export default GuideTooltip;
