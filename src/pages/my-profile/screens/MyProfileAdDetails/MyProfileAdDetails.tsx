import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { FullPageMobileWrapper } from '@/components';
import { api } from '@/hooks';
import { useQueryString } from '@/hooks/custom-hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Loader, Text, TextArea, useDevice } from '@deriv-com/ui';
import './MyProfileAdDetails.scss';

type TMYProfileAdDetailsTextAreaProps = {
    advertDescription: string;
    contactInfo: string;
    setAdvertDescription: Dispatch<SetStateAction<string>>;
    setContactInfo: Dispatch<SetStateAction<string>>;
};

const MyProfileAdDetailsTextArea = ({
    advertDescription,
    contactInfo,
    setAdvertDescription,
    setContactInfo,
}: TMYProfileAdDetailsTextAreaProps) => {
    const { localize } = useTranslations();
    return (
        <>
            <TextArea
                data-testid='dt_profile_ad_details_contact'
                label={localize('Contact details')}
                maxLength={300}
                onChange={e => setContactInfo(e.target.value)}
                textSize='sm'
                value={contactInfo}
            />
            <TextArea
                data-testid='dt_profile_ad_details_description'
                hint={localize('This information will be visible to everyone.')}
                label={localize('Instructions')}
                maxLength={300}
                onChange={e => setAdvertDescription(e.target.value)}
                textSize='sm'
                value={advertDescription}
            />
        </>
    );
};

const MyProfileAdDetails = () => {
    const { data: advertiserInfo, isLoading } = api.advertiser.useGetInfo();
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

    if (isLoading && !advertiserInfo) return <Loader className='mt-16' />;

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
                        <Localize i18n_default_text='Save' />
                    </Button>
                )}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        <Localize i18n_default_text='Ad Details ' />
                    </Text>
                )}
            >
                <div className='my-profile-ad-details'>
                    <MyProfileAdDetailsTextArea
                        advertDescription={advertDescription}
                        contactInfo={contactInfo}
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
                advertDescription={advertDescription}
                contactInfo={contactInfo}
                setAdvertDescription={setAdvertDescription}
                setContactInfo={setContactInfo}
            />
            <div className='my-profile-ad-details__border' />
            <Button disabled={!hasUpdated} onClick={submitAdDetails} size='lg' textSize='sm'>
                <Localize i18n_default_text='Save' />
            </Button>
        </div>
    );
};

export default MyProfileAdDetails;
