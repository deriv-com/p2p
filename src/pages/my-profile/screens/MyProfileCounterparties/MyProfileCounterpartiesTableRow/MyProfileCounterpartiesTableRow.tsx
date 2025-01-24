import { memo } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { UserAvatar } from '@/components';
import { BlockUnblockUserModal } from '@/components/Modals';
import { ADVERTISER_URL } from '@/constants';
import { useGetPhoneNumberVerification, useIsAdvertiserBarred, useModalManager } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './MyProfileCounterpartiesTableRow.scss';

type TMyProfileCounterpartiesTableRowProps = {
    id: string;
    isBlocked: boolean;
    nickname: string;
};

const MyProfileCounterpartiesTableRow = ({ id, isBlocked, nickname }: TMyProfileCounterpartiesTableRowProps) => {
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { localize } = useTranslations();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const { shouldShowVerification } = useGetPhoneNumberVerification();

    return (
        <>
            <div className='my-profile-counterparties-table-row'>
                <div
                    className={clsx('my-profile-counterparties-table-row__nickname-wrapper', {
                        'my-profile-counterparties-table-row__nickname-wrapper--barred': isAdvertiserBarred,
                    })}
                    onClick={() => {
                        isAdvertiserBarred ? undefined : history.push(`${ADVERTISER_URL}/${id}`, { from: 'MyProfile' });
                    }}
                >
                    <UserAvatar className='h-[3rem] w-[3rem]' nickname={nickname} size={65} textSize='sm' />
                    <Text size={isDesktop ? 'sm' : 'md'}>{nickname}</Text>
                </div>
                <Button
                    className='border-[1px]'
                    color={isBlocked ? 'black' : 'primary'}
                    data-testid='dt_block_unblock_button'
                    disabled={shouldShowVerification}
                    onClick={() => {
                        showModal('BlockUnblockUserModal');
                    }}
                    variant='outlined'
                >
                    {isBlocked ? localize('Unblock') : localize('Block')}
                </Button>
            </div>
            {isModalOpenFor('BlockUnblockUserModal') && (
                <BlockUnblockUserModal
                    advertiserName={nickname}
                    id={id}
                    isBlocked={isBlocked}
                    isModalOpen={!!isModalOpenFor('BlockUnblockUserModal')}
                    onRequestClose={hideModal}
                />
            )}
        </>
    );
};

export default memo(MyProfileCounterpartiesTableRow);
