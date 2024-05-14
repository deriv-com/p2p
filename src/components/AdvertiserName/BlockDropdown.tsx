import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { BlockUnblockUserModal } from '@/components/Modals';
import { useAdvertiserStats, useModalManager } from '@/hooks';
import { LabelPairedEllipsisVerticalMdRegularIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './BlockDropdown.scss';

type TBlockDropdownProps = {
    id?: string;
    onClickBlocked?: () => void;
};

const BlockDropdown = ({ id, onClickBlocked }: TBlockDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { data } = useAdvertiserStats(id);
    const { isBlocked, name = '' } = data ?? {};
    const ref = useRef(null);
    useOnClickOutside(ref, () => setVisible(false));
    const { isMobile } = useDevice();

    return (
        <div className='block-dropdown' ref={ref}>
            <Button color='white' variant='outlined'>
                <LabelPairedEllipsisVerticalMdRegularIcon
                    className='popover-dropdown__icon'
                    data-testid='dt_popover_dropdown_icon'
                    onClick={() => setVisible(prevState => !prevState)}
                />
            </Button>
            {visible && (
                <div className='block-dropdown__list'>
                    <Button
                        className='block-dropdown__list-item'
                        color='black'
                        onClick={() => {
                            showModal('BlockUnblockUserModal');
                            setVisible(false);
                        }}
                        variant='ghost'
                    >
                        <Text className='block-dropdown__list-item__label' size={isMobile ? 'md' : 'sm'}>
                            Block
                        </Text>
                    </Button>
                </div>
            )}
            <BlockUnblockUserModal
                advertiserName={name}
                id={id ?? ''}
                isBlocked={!!isBlocked}
                isModalOpen={!!isModalOpenFor('BlockUnblockUserModal')}
                onClickBlocked={onClickBlocked}
                onRequestClose={hideModal}
            />
        </div>
    );
};

export default BlockDropdown;
