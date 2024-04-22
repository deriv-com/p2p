import { memo, useEffect, useState } from 'react';
import { TAdvertiserStats } from 'types';

import { Text, ToggleSwitch } from '@deriv-com/ui';

import { api } from '@/hooks';

import './AdvertiserNameToggle.scss';

type TAdvertiserNameToggle = {
    advertiserInfo: DeepPartial<TAdvertiserStats>;
    onToggle?: (shouldShowRealName: boolean) => void;
};
const AdvertiserNameToggle = memo(({ advertiserInfo, onToggle }: TAdvertiserNameToggle) => {
    const [shouldShowRealName, setShouldShowRealName] = useState(false);
    const { mutate: advertiserUpdate } = api.advertiser.useUpdate();

    useEffect(() => {
        setShouldShowRealName(advertiserInfo?.should_show_name || false);
    }, [advertiserInfo?.should_show_name]);

    const onToggleShowRealName = () => {
        advertiserUpdate({
            show_name: !shouldShowRealName ? 1 : 0,
        });
        setShouldShowRealName(!shouldShowRealName);
        onToggle?.(!shouldShowRealName);
    };

    return (
        <div className='p2p-advertiser-name-toggle'>
            <div className='p2p-advertiser-name-toggle__label'>
                <Text lineHeight='lg' size='sm'>
                    Show my real name
                </Text>
                <Text className='p2p-advertiser-name-toggle__label-real-name' color='less-prominent' lineHeight='xs'>
                    {advertiserInfo?.fullName}
                </Text>
            </div>
            <ToggleSwitch onChange={onToggleShowRealName} value={shouldShowRealName} />
        </div>
    );
});
AdvertiserNameToggle.displayName = 'AdvertiserNameToggle';

export default AdvertiserNameToggle;
