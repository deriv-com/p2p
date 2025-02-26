import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import './AwarenessBanner.scss';

const AwarenessBanner = () => {
    const { isDesktop } = useDevice();

    return (
        <InlineMessage className='awareness-banner' iconPosition={isDesktop ? 'center' : 'top'} variant='warning'>
            <Text size='xs'>
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text='<0>Stay safe:</0> Never share login details or verification codes. Check URLs and contact us only via live chat.'
                />
            </Text>
        </InlineMessage>
    );
};

export default AwarenessBanner;
