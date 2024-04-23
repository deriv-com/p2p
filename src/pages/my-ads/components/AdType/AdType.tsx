import { Text } from '@deriv-com/ui';
import './AdType.scss';

type TAdTypeProps = {
    adPauseColor: string;
    floatRate: string;
};
const AdType = ({ adPauseColor, floatRate }: TAdTypeProps) => {
    return (
        <div className='ad-type'>
            <Text as='span' className='ad-type__badge' color={adPauseColor} size='2xs'>
                Float
            </Text>
            <Text as='span' color={adPauseColor} size='2xs'>
                {floatRate}%
            </Text>
        </div>
    );
};

export default AdType;
