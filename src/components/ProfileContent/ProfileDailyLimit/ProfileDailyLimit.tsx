import { DailyLimitModal } from '@/components/Modals';
import { api } from '@/hooks';
import { useAdvertiserStats, useModalManager } from '@/hooks/custom-hooks';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './ProfileDailyLimit.scss';

const ProfileDailyLimit = () => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { isDesktop } = useDevice();
    const { data: advertiserStats } = useAdvertiserStats();
    const { data: activeAccount } = api.account.useActiveAccount();
    const textSize = isDesktop ? 'xs' : 'sm';

    return (
        <>
            <div className='profile-daily-limit' data-testid='dt_profile_daily_limit'>
                <Text color='less-prominent' size={textSize}>
                    <Localize
                        components={[<strong key={0} />, <strong key={1} />]}
                        i18n_default_text='Want to increase your daily limits to <0>{{maxDailyBuy}} {{currency}}</0> (buy) and <1>{{maxDailySell}} {{currency}}</1> (sell)?'
                        values={{
                            currency: activeAccount?.currency,
                            maxDailyBuy: advertiserStats?.daily_buy_limit,
                            maxDailySell: advertiserStats?.daily_sell_limit,
                        }}
                    />
                </Text>
                <Button
                    color='primary-light'
                    onClick={() => showModal('DailyLimitModal')}
                    size='sm'
                    textSize={textSize}
                    variant='ghost'
                >
                    <Localize i18n_default_text='Increase my limits' />
                </Button>
            </div>
            {isModalOpenFor('DailyLimitModal') && (
                <DailyLimitModal currency={activeAccount?.currency || 'USD'} isModalOpen onRequestClose={hideModal} />
            )}
        </>
    );
};

export default ProfileDailyLimit;
