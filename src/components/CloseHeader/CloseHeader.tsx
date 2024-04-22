import { LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

import { useDevice } from '@/hooks/custom-hooks';

import './CloseHeader.scss';

const CloseHeader = () => {
    const { isMobile } = useDevice();

    return (
        <div className='p2p-close-header'>
            <Text size={isMobile ? 'lg' : 'xl'} weight='bold'>
                {isMobile ? 'Deriv P2P' : 'Cashier'}
            </Text>
            <LabelPairedXmarkLgBoldIcon
                className='p2p-close-header--icon'
                data-testid='dt_close_header_close_icon'
                onClick={() => window.history.back()}
            />
        </div>
    );
};

export default CloseHeader;
