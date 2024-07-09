import { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageReturn, ProfileContent } from '@/components';
import BlockDropdown from '@/components/AdvertiserName/BlockDropdown';
import { BUY_SELL_URL, MY_PROFILE_URL } from '@/constants';
import { api, useAdvertiserStats, useModalManager } from '@/hooks';
import { useTranslations } from '@deriv-com/translations';
import { Loader, useDevice } from '@deriv-com/ui';
import { AdvertiserAdvertsTable } from '../AdvertiserAdvertsTable';
import { AdvertiserBlockOverlay } from '../AdvertiserBlockOverlay';
import './Advertiser.scss';

const Advertiser = () => {
    const { localize } = useTranslations();
    const { isDesktop, isMobile } = useDevice();
    const { showModal } = useModalManager();
    const { advertiserId } = useParams<{ advertiserId: string }>();
    const { data: advertiserInfo } = api.advertiser.useGetInfo();
    const [showOverlay, setShowOverlay] = useState(false);
    const [advertiserName, setAdvertiserName] = useState('');

    // Need to return undefined if the id is the same as the logged in user
    // This will prevent the API from trying to resubscribe to the same user and grab the data from local storage
    const id = advertiserId !== advertiserInfo.id ? advertiserId : undefined;
    const history = useHistory();
    const location = useLocation();

    const { data, isLoading, unsubscribe } = useAdvertiserStats(id);

    return (
        <div className='advertiser'>
            <PageReturn
                className='lg:mt-0'
                hasBorder={!isDesktop}
                onClick={() => {
                    history.push(
                        (location.state as { from: string })?.from === 'MyProfile'
                            ? `${MY_PROFILE_URL}?tab=My+counterparties`
                            : BUY_SELL_URL
                    );
                    unsubscribe();
                }}
                pageTitle={localize('Advertiser’s page')}
                {...(!isDesktop && {
                    rightPlaceHolder: (
                        <BlockDropdown
                            id={advertiserId}
                            onClickBlocked={() => {
                                setShowOverlay(prevState => !prevState);
                            }}
                        />
                    ),
                })}
                size={isMobile ? 'lg' : 'md'}
                weight='bold'
            />
            {isLoading ? (
                <Loader className='mt-0 lg:mt-80' />
            ) : (
                <AdvertiserBlockOverlay
                    advertiserName={advertiserName}
                    id={id}
                    isOverlayVisible={showOverlay}
                    onClickUnblock={() => showModal('BlockUnblockUserModal')}
                    setShowOverlay={setShowOverlay}
                >
                    <ProfileContent data={data} setAdvertiserName={setAdvertiserName} setShowOverlay={setShowOverlay} />
                    <AdvertiserAdvertsTable advertiserId={advertiserId} />
                </AdvertiserBlockOverlay>
            )}
        </div>
    );
};

export default Advertiser;
