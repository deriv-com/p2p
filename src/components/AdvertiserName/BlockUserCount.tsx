import { TLocalize } from 'types';
import { useModalManager } from '@/hooks';
import { LabelPairedCircleUserSlashSmRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Text, Tooltip, useDevice } from '@deriv-com/ui';
import { BlockUserCountModal } from '../Modals';
import './BlockUserCount.scss';

type TBlockUserCount = {
    count?: number;
};

const getMessage = (localize: TLocalize, count = 0) => {
    switch (count) {
        case 0:
            return localize('Nobody has blocked you. Yay!');
        case 1:
            return localize('{{count}} person has blocked you', {
                count,
            });
        default:
            return localize('{{count}} people have blocked you', {
                count,
            });
    }
};

const BlockUserCount = ({ count }: TBlockUserCount) => {
    const { localize } = useTranslations();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { isDesktop, isMobile } = useDevice();
    return (
        <div className='block-user-count'>
            <Tooltip
                as='button'
                className='block-user-count__tooltip'
                data-testid='dt_block_user_count_button'
                onClick={() => {
                    isDesktop ? undefined : showModal('BlockUserCountModal');
                }}
                tooltipContent={'asd'}
            >
                <LabelPairedCircleUserSlashSmRegularIcon />

                <Text color='less-prominent' size={isMobile ? 'xs' : 'sm'}>
                    {count ?? 0}
                </Text>
            </Tooltip>
            {!!isModalOpenFor('BlockUserCountModal') && (
                <BlockUserCountModal isModalOpen message={getMessage(localize, count)} onRequestClose={hideModal} />
            )}
        </div>
    );
};

export default BlockUserCount;
