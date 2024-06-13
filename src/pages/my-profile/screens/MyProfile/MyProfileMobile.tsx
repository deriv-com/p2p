import { TAdvertiserStats } from 'types';
import { MobileTabs, ProfileContent } from '@/components';
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
                onChangeTab={clickedTab =>
                    setQueryString({
                        tab: clickedTab,
                    })
                }
                tabs={['Stats', 'Payment methods', 'Ad details', 'My counterparties']}
            />
        </>
    );
};

export default MyProfileMobile;
