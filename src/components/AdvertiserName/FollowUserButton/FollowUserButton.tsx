import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ErrorModal } from '@/components/Modals';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { BUY_SELL_URL } from '@/constants';
import { api } from '@/hooks';
import { useAdvertiserStats, useIsAdvertiserBarred, useModalManager } from '@/hooks/custom-hooks';
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
    const {
        mutate: onFollow,
        mutation: { error: followError, reset: resetFollowError },
    } = api.counterparty.useFollow();
    const {
        mutate: onUnfollow,
        mutation: { error: unfollowError, reset: resetUnfollowError },
    } = api.counterparty.useUnfollow();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const history = useHistory();

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

    const onCloseErrorModal = () => {
        if (followError) resetFollowError();
        else if (unfollowError) resetUnfollowError();
        hideModal();
        history.push(BUY_SELL_URL);
    };

    useEffect(() => {
        if (followError || unfollowError) {
            showModal('ErrorModal');
        }
    }, [followError, showModal, unfollowError]);

    return (
        <>
            <OnboardingTooltip
                buttonText={<Localize i18n_default_text='OK' />}
                className='gap-[0.4rem] lg:mt-[0.6rem] mt-0 p-[0.4rem]'
                description={
                    <Localize i18n_default_text='Follow your favourite advertisers and set a filter to see their ads first in your Buy/Sell list.' />
                }
                icon={
                    <Button
                        color='black'
                        disabled={isAdvertiserBarred}
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
            {isModalOpenFor('ErrorModal') && (
                <ErrorModal
                    isModalOpen
                    message={followError?.message || unfollowError?.message}
                    onRequestClose={onCloseErrorModal}
                />
            )}
        </>
    );
};

export default FollowUserButton;
