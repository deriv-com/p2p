import clsx from 'clsx';
import { useDevice } from '@/hooks/custom-hooks';
import { Text } from '@deriv-com/ui';
import './AdStatus.scss';

type TAdStatusProps = {
    isActive?: boolean;
};

const AdStatus = ({ isActive = false }: TAdStatusProps) => {
    const { isMobile } = useDevice();
    return (
        <Text
            align='center'
            className={clsx({
                'ad-status--active': isActive,
                'ad-status--inactive': !isActive,
            })}
            color={isActive ? 'success' : 'error'}
            size={isMobile ? 'md' : 'sm'}
            weight='bold'
        >
            {isActive ? 'Active' : 'Inactive'}
        </Text>
    );
};

export default AdStatus;
