import { useDevice } from '@/hooks/custom-hooks';
import { LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './CloseHeader.scss';

const CloseHeader = () => {
    const { isMobile } = useDevice();

    return (
        <div className='close-header'>
            <Text size={isMobile ? 'lg' : 'xl'} weight='bold'>
                {isMobile ? 'Deriv P2P' : 'Cashier'}
            </Text>
            <LabelPairedXmarkLgBoldIcon
                className='close-header--icon'
                data-testid='dt_close_header_close_icon'
                onClick={() => window.history.back()}
            />
        </div>
    );
};

export default CloseHeader;
