import { TTextColors } from 'types';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './AdType.scss';

type TAdTypeProps = {
    adPauseColor: TTextColors;
    floatRate: string;
};
const AdType = ({ adPauseColor, floatRate }: TAdTypeProps) => {
    const { isDesktop } = useDevice();
    return (
        <div className='ad-type'>
            <Text as='span' className='ad-type__badge' color={adPauseColor} size={isDesktop ? 'xs' : 'sm'}>
                <Localize i18n_default_text='Float' />
            </Text>
            <Text as='span' color={adPauseColor} size={isDesktop ? 'xs' : 'sm'}>
                {floatRate}%
            </Text>
        </div>
    );
};

export default AdType;
