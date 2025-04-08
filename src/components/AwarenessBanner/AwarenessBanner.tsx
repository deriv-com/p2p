import { useLocalStorage } from 'usehooks-ts';
import { api } from '@/hooks';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import './AwarenessBanner.scss';

const AwarenessBanner = () => {
    const { isDesktop } = useDevice();
    const { data } = api.account.useActiveAccount();
    const [isAwarenessBannerHidden, setIsAwarenessBannerHidden] = useLocalStorage(
        `p2p_${data?.loginid}_is_awareness_banner_hidden`,
        false
    );

    if (isAwarenessBannerHidden) return null;

    return (
        <InlineMessage className='awareness-banner' iconPosition={isDesktop ? 'center' : 'top'} variant='warning'>
            <div className='flex flex-row items-center justify-between w-full'>
                <Text size='xs'>
                    <Localize
                        components={[<strong key={0} />]}
                        i18n_default_text='<0>Stay safe:</0> Never share login details or verification codes. Check URLs and contact us only via live chat.'
                    />
                </Text>
                <StandaloneXmarkBoldIcon
                    className='cursor-pointer h-12 lg:h-8 lg:scale-[1.25]'
                    iconSize={isDesktop ? 'sm' : 'lg'}
                    onClick={() => {
                        setIsAwarenessBannerHidden(true);
                    }}
                />
            </div>
        </InlineMessage>
    );
};

export default AwarenessBanner;
