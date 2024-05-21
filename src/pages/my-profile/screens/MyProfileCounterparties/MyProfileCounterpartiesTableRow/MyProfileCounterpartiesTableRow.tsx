import { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { UserAvatar } from '@/components';
import { BlockUnblockUserModal } from '@/components/Modals';
import { ADVERTISER_URL } from '@/constants';
import { useModalManager } from '@/hooks/custom-hooks';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './MyProfileCounterpartiesTableRow.scss';

type TMyProfileCounterpartiesTableRowProps = {
    id: string;
    isBlocked: boolean;
    nickname: string;
};

const MyProfileCounterpartiesTableRow = ({ id, isBlocked, nickname }: TMyProfileCounterpartiesTableRowProps) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    return (
        <>
            <div className='my-profile-counterparties-table-row'>
                <div
                    className='my-profile-counterparties-table-row__nickname-wrapper'
                    onClick={() => history.push(`${ADVERTISER_URL}/${id}`, { from: 'MyProfile' })}
                >
                    <UserAvatar className='h-[3rem] w-[3rem]' nickname={nickname} size={65} textSize='sm' />
                    <Text size={isMobile ? 'md' : 'sm'}>{nickname}</Text>
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
            />
        </>
    );
};

export default memo(MyProfileCounterpartiesTableRow);
