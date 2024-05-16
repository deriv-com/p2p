import { BlockUnblockUserModal } from '@/components/Modals';
import { useAdvertiserStats, useModalManager } from '@/hooks';
import { LabelPairedEllipsisVerticalXlRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Dropdown } from '@deriv-com/ui';
import './BlockDropdown.scss';

type TBlockDropdownProps = {
    id?: string;
    onClickBlocked?: () => void;
};

const BlockDropdown = ({ id, onClickBlocked }: TBlockDropdownProps) => {
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { data } = useAdvertiserStats(id);
    const { is_blocked: isBlocked, name = '' } = data ?? {};
    return (
        <div className='block-dropdown'>
            <Dropdown
                dropdownIcon={<LabelPairedEllipsisVerticalXlRegularIcon data-testid='dt_block_dropdown_icon' />}
                list={[
                    {
                        text: localize('Block'),
                        value: 'block',
                    },
                ]}
                name='block-user-dropdown'
                onSelect={() => showModal('BlockUnblockUserModal')}
            />
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
