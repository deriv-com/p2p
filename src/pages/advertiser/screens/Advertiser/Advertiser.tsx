import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageReturn, ProfileContent } from '@/components';
import { BUY_SELL_URL, MY_PROFILE_URL } from '@/constants';
import { api } from '@/hooks';
import { LabelPairedEllipsisVerticalLgRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { AdvertiserAdvertsTable } from '../AdvertiserAdvertsTable';
import './Advertiser.scss';

const Advertiser = () => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const { advertiserId } = useParams<{ advertiserId: string }>();
    const { data: advertiserInfo } = api.advertiser.useGetInfo();

    // Need to return undefined if the id is the same as the logged in user
    // This will prevent the API from trying to resubscribe to the same user and grab the data from local storage
    const id = advertiserId !== advertiserInfo.id ? advertiserId : undefined;
    const history = useHistory();
    const location = useLocation();

    return (
        <div className='advertiser'>
            <PageReturn
                className='lg:mt-0'
                hasBorder={isMobile}
                onClick={() =>
                    history.push(
                        (location.state as { from: string })?.from === 'MyProfile'
                            ? `${MY_PROFILE_URL}?tab=My+counterparties`
                            : BUY_SELL_URL
                    )
                }
                pageTitle={localize('Advertiser’s page')}
                {...(isMobile && {
                    rightPlaceHolder: <LabelPairedEllipsisVerticalLgRegularIcon className='cursor-pointer' />,
                })}
                weight='bold'
            />
            <ProfileContent id={id} />
            <AdvertiserAdvertsTable advertiserId={advertiserId} />
        </div>
    );
};

export default Advertiser;
