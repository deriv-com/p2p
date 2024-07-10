import { FullPageMobileWrapper } from '@/components';
import { useQueryString } from '@/hooks/custom-hooks';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import MyProfileStats from './MyProfileStats';

const MyProfileStatsMobile = () => {
    const { setQueryString } = useQueryString();
    const { isMobile } = useDevice();
    return (
        <FullPageMobileWrapper
            className='absolute top-0'
            onBack={() =>
                setQueryString({
                    tab: 'default',
                })
            }
            renderHeader={() => (
                <Text lineHeight='xs' size={isMobile ? 'lg' : 'md'} weight='bold'>
                    <Localize i18n_default_text='Stats' />
                </Text>
            )}
        >
            <MyProfileStats />
        </FullPageMobileWrapper>
    );
};

export default MyProfileStatsMobile;
