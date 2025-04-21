import clsx from 'clsx';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import './PNVBanner.scss';

const PNVBanner = () => {
    const { isDesktop } = useDevice();

    return (
        <InlineMessage className='pnv-banner' iconPosition={isDesktop ? 'center' : 'top'} variant='warning'>
            <div
                className={clsx('flex', {
                    'flex-col': !isDesktop,
                })}
            >
                <Text as='div' className={isDesktop ? 'mr-2' : ''} size='xs'>
                    <Localize i18n_default_text='Verify your phone number to continue using Deriv P2P.' />
                </Text>
                <Text as='div' className='underline' size='xs' weight='bold'>
                    <Localize
                        components={[
                            <a
                                href={`${URLConstants.derivAppStaging}/account/personal-details?platform=p2p-v2`}
                                key={0}
                            />,
                        ]}
                        i18n_default_text='<0>Verify now</0>'
                    />
                </Text>
            </div>
        </InlineMessage>
    );
};

export default PNVBanner;
