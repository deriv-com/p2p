import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { THooks } from 'types';
import { FullPageMobileWrapper, TextArea } from '@/components';
import { api } from '@/hooks';
import { useQueryString } from '@/hooks/custom-hooks';
import { Button, useDevice } from '@deriv-com/ui';
import './MyProfileAdDetails.scss';

type TMYProfileAdDetailsTextAreaProps = {
    advertiserInfo: THooks.Advertiser.GetInfo;
    setAdvertDescription: Dispatch<SetStateAction<string>>;
    setContactInfo: Dispatch<SetStateAction<string>>;
};

const MyProfileAdDetailsTextArea = ({
    advertiserInfo,
    setAdvertDescription,
    setContactInfo,
}: TMYProfileAdDetailsTextAreaProps) => {
    return (
        <>
            <TextArea
                label='Contact details'
                maxLength={300}
                onChange={e => setContactInfo((e.target as HTMLInputElement).value)}
                testId='dt_profile_ad_details_contact'
                value={advertiserInfo?.contact_info || ''}
            />
            <TextArea
                hint='This information will be visible to everyone.'
                label='Instructions'
                maxLength={300}
                onChange={e => setAdvertDescription((e.target as HTMLInputElement).value)}
                testId='dt_profile_ad_details_description'
                value={advertiserInfo?.default_advert_description || ''}
            />
        </>
    );
};

const MyProfileAdDetails = () => {
    const { data: advertiserInfo } = api.advertiser.useGetInfo();
    const { mutate: updateAdvertiser } = api.advertiser.useUpdate();
    const [contactInfo, setContactInfo] = useState('');
    const [advertDescription, setAdvertDescription] = useState('');
    const { isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    const hasUpdated = useMemo(() => {
        return (
            contactInfo !== advertiserInfo?.contact_info ||
            advertDescription !== advertiserInfo?.default_advert_description
        );
    }, [advertiserInfo?.contact_info, advertiserInfo?.default_advert_description, contactInfo, advertDescription]);

    useEffect(() => {
        setContactInfo(advertiserInfo?.contact_info || '');
        setAdvertDescription(advertiserInfo?.default_advert_description || '');
    }, [advertiserInfo]);

    const submitAdDetails = () => {
        updateAdvertiser({
            contact_info: contactInfo,
            default_advert_description: advertDescription,
        });
    };

    //TODO: Uncomment once isLoading is implemented from api-hooks
    //if (isLoading) return <Loader />;

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='my-profile-ad-details__mobile-wrapper'
                onBack={() =>
                    setQueryString({
                        tab: 'default',
                    })
                }
                renderFooter={() => (
                    <Button disabled={!hasUpdated} isFullWidth onClick={submitAdDetails} size='lg'>
                        Save
                    </Button>
                )}
                renderHeader={() => <h1 className='my-profile-ad-details__header'>Ad Details</h1>}
            >
                <div className='my-profile-ad-details'>
                    <MyProfileAdDetailsTextArea
                        advertiserInfo={advertiserInfo}
                        setAdvertDescription={setAdvertDescription}
                        setContactInfo={setContactInfo}
                    />
                </div>
            </FullPageMobileWrapper>
        );
    }
    return (
        <div className='my-profile-ad-details'>
            <MyProfileAdDetailsTextArea
                advertiserInfo={advertiserInfo}
                setAdvertDescription={setAdvertDescription}
                setContactInfo={setContactInfo}
            />
            <div className='my-profile-ad-details__border' />
            <Button disabled={!hasUpdated} onClick={submitAdDetails} size='lg' textSize='sm'>
                Save
            </Button>
        </div>
    );
};

export default MyProfileAdDetails;
