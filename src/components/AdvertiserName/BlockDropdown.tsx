import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { BlockUnblockUserModal } from '@/components/Modals';
import { useAdvertiserStats, useModalManager } from '@/hooks';
import { LabelPairedEllipsisVerticalMdRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
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
    const { is_blocked: isBlocked, name = '' } = data ?? {};
    const ref = useRef(null);
    useOnClickOutside(ref, () => setVisible(false));
    const { isMobile } = useDevice();

    return (
        <div className='block-dropdown' ref={ref}>
            <Button color='white' variant='outlined'>
                <LabelPairedEllipsisVerticalMdRegularIcon
                    data-testid='dt_block_dropdown_icon'
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
                            <Localize i18n_default_text='Block' />
                        </Text>
                    </Button>
                </div>
            )}
            {isModalOpenFor('BlockUnblockUserModal') && (
                <BlockUnblockUserModal
                    advertiserName={name}
                    id={id ?? ''}
                    isBlocked={!!isBlocked}
                    isModalOpen
                    onClickBlocked={onClickBlocked}
                    onRequestClose={hideModal}
                />
            )}
        </div>
    );
};

export default BlockDropdown;
