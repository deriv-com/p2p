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
import { LocalStorageConstants } from '@deriv-com/utils';

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
                className='absolute p-[0.2rem] lg:right-12 right-0 lg:mt-2 mt-0'
                description={
                    <Localize i18n_default_text='Follow your favourite advertisers and set a filter to see their ads first in your Buy/Sell list.' />
                }
                disabledClassName='lg:top-[-0.1rem]'
                icon={
                    <div>
                        <Button
                            className='gap-[0.4rem] p-[0.4rem] border-[1px]'
                            color='black'
                            disabled={isAdvertiserBarred}
                            icon={<StandaloneUserPlusFillIcon fill={isFollowing ? '#FFF' : '#000'} iconSize='xs' />}
                            onClick={handleFollowUnfollowUser}
                            size='sm'
                            variant={isFollowing ? 'contained' : 'outlined'}
                        >
                            {getButtonText()}
                        </Button>
                    </div>
                }
                localStorageItemName={LocalStorageConstants.p2pShowFollowUserGuide}
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
