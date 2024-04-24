import { useEffect } from 'react';
import { ProfileContent, Verification } from '@/components';
import { NicknameModal } from '@/components/Modals';
import {
    useAdvertiserStats,
    useIsAdvertiser,
    useModalManager,
    usePoiPoaStatus,
    useQueryString,
} from '@/hooks/custom-hooks';
import { Loader, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileCounterparties } from '../MyProfileCounterparties';
import { MyProfileStats } from '../MyProfileStats';
import { PaymentMethods } from '../PaymentMethods';
import MyProfileMobile from './MyProfileMobile';
import './MyProfile.scss';

const TABS = ['Stats', 'Payment methods', 'Ad details', 'My counterparties'];

const MyProfile = () => {
    const { isMobile } = useDevice();
    const { queryString, setQueryString } = useQueryString();
    const { data } = usePoiPoaStatus();
    const { data: advertiserStats, isLoading } = useAdvertiserStats();
    const { isP2PPoaRequired, isPoaVerified, isPoiVerified } = data || {};
    const isAdvertiser = useIsAdvertiser();
    const { hideModal, isModalOpenFor, showModal } = useModalManager({ shouldReinitializeModals: false });

    const currentTab = queryString.tab;

    const tabs = [
        { component: <MyProfileStats />, title: 'Stats' },
        { component: <PaymentMethods />, title: 'Payment methods' },
        { component: <MyProfileAdDetails />, title: 'Ad details' },
        { component: <MyProfileCounterparties />, title: 'My counterparties' },
    ];

    useEffect(() => {
        const isPoaPoiVerified = (!isP2PPoaRequired || isPoaVerified) && isPoiVerified;
        if (isPoaPoiVerified && !isAdvertiser) showModal('NicknameModal');
    }, [isAdvertiser, isP2PPoaRequired, isPoaVerified, isPoiVerified]);

    if (isLoading && !advertiserStats) {
        return <Loader />;
    }

    if (!isPoiVerified || !isPoaVerified) {
        return <Verification />;
    }

    if (isMobile) {
        return (
            <div className='my-profile'>
                <MyProfileMobile />
                <NicknameModal isModalOpen={!!isModalOpenFor('NicknameModal')} onRequestClose={hideModal} />
            </div>
        );
    }

    return (
        <div className='my-profile'>
            <ProfileContent />
            <Tabs
                activeTab={(currentTab !== 'default' && currentTab) || 'Stats'}
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
            <NicknameModal isModalOpen={!!isModalOpenFor('NicknameModal')} onRequestClose={hideModal} />
        </div>
    );
};

export default MyProfile;
