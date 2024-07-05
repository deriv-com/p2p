import { Dispatch, memo, SetStateAction } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { UserAvatar } from '@/components';
import { BlockUnblockUserModal } from '@/components/Modals';
import { ADVERTISER_URL } from '@/constants';
import { useIsAdvertiserBarred, useModalManager } from '@/hooks/custom-hooks';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './MyProfileCounterpartiesTableRow.scss';

type TMyProfileCounterpartiesTableRowProps = {
    id: string;
    isBlocked: boolean;
    nickname: string;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
};

const MyProfileCounterpartiesTableRow = ({
    id,
    isBlocked,
    nickname,
    setErrorMessage,
}: TMyProfileCounterpartiesTableRowProps) => {
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const isAdvertiserBarred = useIsAdvertiserBarred();

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
                    className='w-36 border-[1px]'
                    color={isBlocked ? 'black' : 'primary'}
                    data-testid='dt_block_unblock_button'
                    onClick={() => {
                        showModal('BlockUnblockUserModal');
                    }}
                    variant='outlined'
                >
                    {isBlocked ? 'Unblock' : 'Block'}
                </Button>
            </div>
            <BlockUnblockUserModal
                advertiserName={nickname}
                id={id}
                isBlocked={isBlocked}
                isModalOpen={!!isModalOpenFor('BlockUnblockUserModal')}
                onRequestClose={hideModal}
                setErrorMessage={setErrorMessage}
            />
        </>
    );
};

export default memo(MyProfileCounterpartiesTableRow);
