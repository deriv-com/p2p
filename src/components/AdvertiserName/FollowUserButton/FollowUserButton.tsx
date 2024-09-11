import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { api, useAdvertiserStats } from '@/hooks';
import { StandaloneUserPlusFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';

type TFollowUserButtonProps = {
    id?: string;
};

const FollowUserButton = ({ id }: TFollowUserButtonProps) => {
    const { isDesktop } = useDevice();
    const { data } = useAdvertiserStats(id);
    const { is_favourite: isFollowing } = data ?? {};
    const { mutate: onFollow } = api.counterparty.useFollow();
    const { mutate: onUnfollow } = api.counterparty.useUnfollow();

    const handleFollowUnfollowUser = () => {
        if (id) {
            if (isFollowing) onUnfollow([parseInt(id)]);
            else onFollow([parseInt(id)]);
        }
    };

    const getButtonText = () => {
        if (isDesktop) {
            return isFollowing ? <Localize i18n_default_text='Following' /> : <Localize i18n_default_text='Follow' />;
        }
        return '';
    };

    return (
        <OnboardingTooltip
            buttonText={<Localize i18n_default_text='OK' />}
            className='gap-[0.4rem] lg:mt-[0.6rem] mt-0 p-[0.4rem]'
            description={
                <Localize i18n_default_text='Follow your favourite advertisers and set a filter to see their ads first in your Buy/Sell list.' />
            }
            icon={
                <Button
                    color='black'
                    icon={<StandaloneUserPlusFillIcon fill={isFollowing ? '#FFF' : '#000'} iconSize='xs' />}
                    size='sm'
                    variant={isFollowing ? 'contained' : 'outlined'}
                >
                    {getButtonText()}
                </Button>
            }
            localStorageItemName='should_show_follow_guide'
            onClickIcon={handleFollowUnfollowUser}
            title={<Localize i18n_default_text='Follow advertisers' />}
        />
    );
};

export default FollowUserButton;
