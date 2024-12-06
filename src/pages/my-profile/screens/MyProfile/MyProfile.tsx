import { useEffect } from 'react';
import { ProfileContent, Verification } from '@/components';
import { NicknameModal } from '@/components/Modals';
import {
    useAdvertiserStats,
    useIsAdvertiser,
    useIsAdvertiserNotVerified,
    useModalManager,
    usePoiPoaStatus,
    useQueryString,
} from '@/hooks/custom-hooks';
import { getLocalizedTabs } from '@/utils/tabs';
import { useTranslations } from '@deriv-com/translations';
import { Loader, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileCounterparties } from '../MyProfileCounterparties';
import { MyProfileStats } from '../MyProfileStats';
import { PaymentMethods } from '../PaymentMethods';
import MyProfileMobile from './MyProfileMobile';
import './MyProfile.scss';

const TABS = ['Stats', 'Payment methods', 'Ad details', 'My counterparties'];

const MyProfile = () => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { queryString, setQueryString } = useQueryString();
    const { data } = usePoiPoaStatus();
    const { data: advertiserStats, isLoading } = useAdvertiserStats();
    const { isPoiPoaVerified } = data || {};
    const isAdvertiser = useIsAdvertiser();
    const isAdvertiserNotVerified = useIsAdvertiserNotVerified();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });

    const currentTab = queryString.tab;

    const tabs = [
        { component: <MyProfileStats />, title: localize('Stats') },
        { component: <PaymentMethods />, title: localize('Payment methods') },
        { component: <MyProfileAdDetails />, title: localize('Ad details') },
        { component: <MyProfileCounterparties />, title: localize('My counterparties') },
    ];

    useEffect(() => {
        if (isPoiPoaVerified && !isAdvertiser) showModal('NicknameModal');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiser, isPoiPoaVerified]);

    if (isLoading && !advertiserStats) {
        return <Loader />;
    }

    if (isAdvertiserNotVerified) {
        return (
            <div className='overflow-y-auto h-[calc(100%-11rem)]'>
                <Verification />
            </div>
        );
    }

    if (!isDesktop) {
        return (
            <div className='my-profile'>
                <MyProfileMobile data={advertiserStats} />
                {!!isModalOpenFor('NicknameModal') && <NicknameModal isModalOpen onRequestClose={hideModal} />}
            </div>
        );
    }

    return (
        <div className='my-profile'>
            <ProfileContent data={advertiserStats} />
            <Tabs
                activeTab={getLocalizedTabs(localize)[(currentTab !== 'default' && currentTab) || 'Stats']}
                className='my-profile__tabs'
                onChange={index => {
                    setQueryString({
                        tab: TABS[index],
                    });
                }}
                variant='primary'
            >
                {tabs.map(tab => (
                    <Tab className='my-profile__tabs-tab' key={tab.title} title={tab.title}>
                        {tab.component}
                    </Tab>
                ))}
            </Tabs>
            {!!isModalOpenFor('NicknameModal') && <NicknameModal isModalOpen onRequestClose={hideModal} />}
        </div>
    );
};

export default MyProfile;
