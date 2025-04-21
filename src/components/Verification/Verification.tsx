import { TLocalize } from 'types';
import { Checklist } from '@/components';
import { useGetPhoneNumberVerification, usePoiPoaStatus } from '@/hooks/custom-hooks';
import { DerivLightIcCashierSendEmailIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Loader, Text, useDevice } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';
import './Verification.scss';

const getPoiAction = (status: string | undefined, localize: TLocalize) => {
    switch (status) {
        case 'pending':
            return localize('Identity verification in progress.');
        case 'rejected':
            return localize('Identity verification failed. Please try again.');
        case 'verified':
            return localize('Identity verified');
        default:
            return localize('Your identity');
    }
};

const getPoaAction = (
    isPoaAuthenticatedWithIdv: boolean | undefined,
    status: string | undefined,
    localize: TLocalize
) => {
    switch (status) {
        case 'pending':
            return localize('Address verification in progress.');
        case 'rejected':
            return localize('Address verification failed. Please try again.');
        case 'verified':
            if (isPoaAuthenticatedWithIdv) return localize('Upload documents to verify your address.');
            return localize('Address verified');
        default:
            return localize('Your address');
    }
};

const getStatus = (status: string | undefined) => {
    if (status === 'verified') return 'done';
    else if (status === 'rejected') return 'rejected';
    return 'action';
};

const Verification = () => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const { isPhoneNumberVerificationEnabled, isPhoneNumberVerified, phoneNumber } = useGetPhoneNumberVerification();
    const { data, isLoading } = usePoiPoaStatus();
    const {
        isP2PPoaRequired,
        isPoaAuthenticatedWithIdv,
        isPoaPending,
        isPoaVerified,
        isPoiPending,
        isPoiVerified,
        poaStatus,
        poiStatus,
    } = data || {};
    const allowPoaRedirection = !isPoaVerified || isPoaAuthenticatedWithIdv;

    const redirectToVerification = (route: string) => {
        const search = window.location.search;
        let updatedUrl = `${route}?ext_platform_url=/cashier/p2p&platform=p2p-v2`;

        if (search) {
            const urlParams = new URLSearchParams(search);
            const updatedUrlParams = new URLSearchParams(updatedUrl);
            urlParams.forEach((value, key) => updatedUrlParams.append(key, value));
            updatedUrl = `${updatedUrl}&${urlParams.toString()}`;
        }

        window.location.href = updatedUrl;
    };

    const checklistItems = [
        ...(isPhoneNumberVerificationEnabled
            ? [
                  {
                      onClick: () => {
                          window.location.href = `${URLConstants.derivAppStaging}/account/personal-details?platform=p2p-v2`;
                      },
                      phoneNumber: isPhoneNumberVerified ? phoneNumber : undefined,
                      status: isPhoneNumberVerified ? 'done' : 'action',
                      testId: 'dt_verification_phone_number_arrow_button',
                      text: isPhoneNumberVerified ? localize('Phone number verified') : localize('Your phone number'),
                  },
              ]
            : []),
        {
            isDisabled: isPoiPending,
            onClick: () => {
                if (!isPoiVerified) redirectToVerification(`${URLConstants.derivAppStaging}/account/proof-of-identity`);
            },
            status: getStatus(poiStatus),
            testId: 'dt_verification_poi_arrow_button',
            text: getPoiAction(poiStatus, localize),
        },
        ...(isP2PPoaRequired
            ? [
                  {
                      isDisabled: isPoaPending,
                      onClick: () => {
                          if (allowPoaRedirection)
                              redirectToVerification(`${URLConstants.derivAppStaging}/account/proof-of-address`);
                      },
                      status: getStatus(poaStatus),
                      testId: 'dt_verification_poa_arrow_button',
                      text: getPoaAction(isPoaAuthenticatedWithIdv, poaStatus, localize),
                  },
              ]
            : []),
    ];

    if (isLoading) return <Loader />;

    return (
        <div className='verification'>
            <DerivLightIcCashierSendEmailIcon className='verification__icon' height={128} width={128} />
            <Text className='verification__text' size={isMobile ? 'lg' : 'md'} weight='bold'>
                <Localize i18n_default_text='Let’s get you secured' />
            </Text>
            <Text align='center' className='verification__text' size={isMobile ? 'lg' : 'sm'}>
                <Localize i18n_default_text='Complete your P2P profile to enjoy secure transactions.' />
            </Text>
            <Checklist items={checklistItems} />
        </div>
    );
};

export default Verification;
