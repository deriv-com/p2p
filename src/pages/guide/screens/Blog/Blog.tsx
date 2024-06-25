import { HOW_TO_PROTECT_YOURSELF_IMAGE_URL, HOW_TO_PROTECT_YOURSELF_URL } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Carousel, GuideCard } from '../../components';

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
                    <GuideCard
                        className='py-[2.4rem]'
                        description={
                            <div>
                                <Text size='sm'>
                                    <Localize i18n_default_text='Protecting your funds and identity is as crucial as ever. Fraudsters are resourceful in finding ways to exploit your information. Read on to learn how to protect yourself when making peer-to-peer payments.' />
                                </Text>
                            </div>
                        }
                        icon={
                            //TODO: Replace this with Quill icon once ready
                            <img
                                onClick={() => {
                                    window.location.href = HOW_TO_PROTECT_YOURSELF_URL;
                                }}
                                src={HOW_TO_PROTECT_YOURSELF_IMAGE_URL}
                            />
                        }
                        key={0}
                        title={
                            <Text size='md' weight='bold'>
                                <Localize i18n_default_text='How to protect yourself on P2P platforms' />
                            </Text>
                        }
                    />,
                ]}
            />
        </div>
    );
};

export default Blog;
