import { useHistory } from 'react-router-dom';
import { TAdvertiserStats } from 'types';
import { MobileTabs, ProfileContent } from '@/components';
import { GUIDE_URL } from '@/constants';
import { useQueryString } from '@/hooks/custom-hooks';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileCounterparties } from '../MyProfileCounterparties';
import MyProfileStatsMobile from '../MyProfileStats/MyProfileStatsMobile';
import { PaymentMethods } from '../PaymentMethods';

type TMyProfileMobileProps = {
    data: TAdvertiserStats;
};

const MyProfileMobile = ({ data }: TMyProfileMobileProps) => {
    const { queryString, setQueryString } = useQueryString();
    const currentTab = queryString.tab;
    const history = useHistory();

    if (currentTab === 'Stats') {
        return <MyProfileStatsMobile />;
    }
    if (currentTab === 'Ad details') {
        return <MyProfileAdDetails />;
    }
    if (currentTab === 'My counterparties') {
        return <MyProfileCounterparties />;
    }
    if (currentTab === 'Payment methods') {
        return <PaymentMethods />;
    }

    return (
        <>
            <ProfileContent data={data} />
            <MobileTabs
                onChangeTab={clickedTab => {
                    if (clickedTab === 'P2P Guide') history.push(GUIDE_URL, { from: 'my-profile' });
                    else
                        setQueryString({
                            tab: clickedTab,
                        });
                }}
                tabs={['Stats', 'Payment methods', 'Ad details', 'My counterparties', 'P2P Guide']}
            />
        </>
    );
};

export default MyProfileMobile;
