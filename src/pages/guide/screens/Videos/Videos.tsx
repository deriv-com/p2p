import { useState } from 'react';
import { ReactComponent as IntroducingDerivP2PIcon } from '@/assets/introducing-deriv-p2p.svg';
import { ReactComponent as UseDerivP2PIcon } from '@/assets/use-deriv-p2p.svg';
import { VideoPlayerModal } from '@/components/Modals';
import { HOW_TO_USE_DERIV_P2P_URL, INTRODUCING_DERIV_P2P_URL } from '@/constants';
import { useModalManager } from '@/hooks/custom-hooks';
import { StandalonePlayFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { Carousel } from '../../components';

const Videos = () => {
    const { isDesktop } = useDevice();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const [videoTitle, setVideoTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const playVideo = (title: string, url: string) => {
        setVideoTitle(title);
        setVideoUrl(url);
        showModal('VideoPlayerModal');
    };

    return (
        <div>
            <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                <Localize i18n_default_text='Videos' />
            </Text>
            <Carousel
                items={[
                    {
                        description: (
                            <Text as='div' className='p-[2.4rem] pt-0' size='sm'>
                                <Localize i18n_default_text='Find out how to get money in and out of your Deriv account easily with Deriv P2P.' />
                            </Text>
                        ),
                        icon: (
                            <div className='grid place-items-center'>
                                <IntroducingDerivP2PIcon
                                    className='row-start-1 col-start-1 rounded-t-[0.8rem]'
                                    preserveAspectRatio='none'
                                />
                                <StandalonePlayFillIcon
                                    className='cursor-pointer row-start-1 col-start-1'
                                    fill='#fff'
                                    iconSize='xl'
                                    onClick={() => playVideo('Introducing Deriv P2P', INTRODUCING_DERIV_P2P_URL)}
                                />
                            </div>
                        ),
                        id: 0,
                        title: (
                            <Text className='px-[2.4rem]' size='md' weight='bold'>
                                <Localize i18n_default_text='Introducing Deriv P2P' />
                            </Text>
                        ),
                    },
                    {
                        description: (
                            <Text as='div' className='p-[2.4rem] pt-0' size='sm'>
                                <Localize i18n_default_text='Find out how to create ads, and how to transfer funds in and out of your Deriv account via P2P payments.' />
                            </Text>
                        ),
                        icon: (
                            <div className='grid place-items-center '>
                                <UseDerivP2PIcon
                                    className='row-start-1 col-start-1 rounded-t-[0.8rem]'
                                    preserveAspectRatio='none'
                                />
                                <StandalonePlayFillIcon
                                    className='cursor-pointer row-start-1 col-start-1'
                                    fill='#fff'
                                    iconSize='xl'
                                    onClick={() => playVideo('How to use the Deriv P2P app', HOW_TO_USE_DERIV_P2P_URL)}
                                />
                            </div>
                        ),
                        id: 1,
                        title: (
                            <Text className='px-[2.4rem]' size='md' weight='bold'>
                                <Localize i18n_default_text='How to use the Deriv P2P app' />
                            </Text>
                        ),
                    },
                ]}
            />
            {!!isModalOpenFor('VideoPlayerModal') && (
                <VideoPlayerModal
                    isModalOpen={!!isModalOpenFor('VideoPlayerModal')}
                    onRequestClose={hideModal}
                    title={videoTitle}
                    url={videoUrl}
                />
            )}
        </div>
    );
};

export default Videos;
