import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { FullPageMobileWrapper } from '@/components';
import { MY_ADS_URL } from '@/constants';
import { useIsAdvertiserBarred } from '@/hooks';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { MyAdsToggle } from '../MyAdsToggle';
import './MyAdsDisplayWrapper.scss';

type TMyAdsDisplayWrapperProps = {
    isPaused: boolean;
    onClickToggle: () => void;
};

const MyAdsDisplayWrapper = ({ children, isPaused, onClickToggle }: PropsWithChildren<TMyAdsDisplayWrapperProps>) => {
    const { isDesktop } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const history = useHistory();

    const goToCreateAd = () => history.push(`${MY_ADS_URL}/adForm?formAction=create`);

    if (!isDesktop) {
        return (
            <FullPageMobileWrapper
                className={clsx('my-ads-display-wrapper', {
                    'my-ads-display-wrapper--barred': isAdvertiserBarred,
                })}
                renderFooter={() => (
                    <Button disabled={isAdvertiserBarred} isFullWidth onClick={goToCreateAd} size='lg' textSize='md'>
                        <Localize i18n_default_text='Create new ad' />
                    </Button>
                )}
                renderHeader={() => (
                    <MyAdsToggle isDisabled={isAdvertiserBarred} isPaused={isPaused} onClickToggle={onClickToggle} />
                )}
                shouldShowBackIcon={false}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }

    return (
        <>
            <div className='flex items-center justify-between my-[1.6rem]'>
                <Button disabled={isAdvertiserBarred} onClick={goToCreateAd} size='lg' textSize='sm'>
                    <Localize i18n_default_text='Create new ad' />
                </Button>
                <MyAdsToggle isDisabled={isAdvertiserBarred} isPaused={isPaused} onClickToggle={onClickToggle} />
            </div>
            {children}
        </>
    );
};

export default MyAdsDisplayWrapper;
