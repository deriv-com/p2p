import { HOW_TO_USE_DERIV_P2P_URL, INTRODUCING_DERIV_P2P_URL } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Carousel, GuideCard } from '../../components';

const Videos = () => {
    const { isDesktop } = useDevice();

    return (
        <div>
            <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                <Localize i18n_default_text='Videos' />
            </Text>
            <Carousel
                items={[
                    <GuideCard
                        description={
                            <Text as='div' className='p-[2.4rem] pt-0' size='sm'>
                                <Localize i18n_default_text='Find out how to get money in and out of your Deriv account easily with Deriv P2P.' />
                            </Text>
                        }
                        key={0}
                        media={<iframe allowFullScreen height='175px' src={INTRODUCING_DERIV_P2P_URL} width='100%' />}
                        title={
                            <Text className='px-[2.4rem]' size='md' weight='bold'>
                                <Localize i18n_default_text='Introducing Deriv P2P' />
                            </Text>
                        }
                    />,
                    <GuideCard
                        description={
                            <Text as='div' className='p-[2.4rem] pt-0' size='sm'>
                                <Localize i18n_default_text='Find out how to create ads, and how to transfer funds in and out of your Deriv account via P2P payments.' />
                            </Text>
                        }
                        icon={<iframe allowFullScreen height='175px' src={HOW_TO_USE_DERIV_P2P_URL} width='100%' />}
                        key={1}
                        title={
                            <Text className='px-[2.4rem]' size='md' weight='bold'>
                                <Localize i18n_default_text='How to use the Deriv P2P app' />
                            </Text>
                        }
                    />,
                ]}
            />
        </div>
    );
};

export default Videos;
