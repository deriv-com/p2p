import clsx from 'clsx';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './AdStatus.scss';

type TAdStatusProps = {
    isActive?: boolean;
};

const AdStatus = ({ isActive = false }: TAdStatusProps) => {
    const { isDesktop } = useDevice();
    return (
        <Text
            align='center'
            className={clsx({
                'ad-status--active': isActive,
                'ad-status--inactive': !isActive,
            })}
            color={isActive ? 'success' : 'error'}
            size={isDesktop ? 'sm' : 'md'}
            weight='bold'
        >
            {isActive ? <Localize i18n_default_text='Active' /> : <Localize i18n_default_text='Inactive' />}
        </Text>
    );
};

export default AdStatus;
