import { HOW_TO_PROTECT_YOURSELF_URL } from '@/constants';
import { DerivLightP2pSecureImageIcon as BlogIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Carousel } from '../../components';

const Blog = () => {
    const { isDesktop } = useDevice();

    return (
        <div>
            <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                <Localize i18n_default_text='Blog' />
            </Text>
            <Carousel
                isControlVisible={false}
                items={[
                    {
                        className: 'py-[2.4rem]',
                        description: (
                            <div>
                                <Text size='sm'>
                                    <Localize i18n_default_text='Protecting your funds and identity is as crucial as ever. Fraudsters are resourceful in finding ways to exploit your information. Read on to learn how to protect yourself when making peer-to-peer payments.' />
                                </Text>
                            </div>
                        ),
                        icon: (
                            <BlogIcon
                                className='cursor-pointer'
                                onClick={() => {
                                    window.open(HOW_TO_PROTECT_YOURSELF_URL, '_blank');
                                }}
                                preserveAspectRatio='none'
                            />
                        ),
                        id: 0,
                        title: (
                            <Text
                                as='a'
                                className='underline'
                                color='red'
                                href={HOW_TO_PROTECT_YOURSELF_URL}
                                size='md'
                                target='_blank'
                                weight='bold'
                            >
                                <Localize i18n_default_text='How to protect yourself on P2P platforms' />
                            </Text>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default Blog;
