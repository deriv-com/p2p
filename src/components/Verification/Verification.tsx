import { TLocalize } from 'types';
import { Checklist } from '@/components';
import { usePoiPoaStatus } from '@/hooks/custom-hooks';
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
            return localize('Identity verification complete.');
        default:
            return localize('Upload documents to verify your identity.');
    }
};

const getPoaAction = (status: string | undefined, localize: TLocalize) => {
    switch (status) {
        case 'pending':
            return localize('Address verification in progress.');
        case 'rejected':
            return localize('Address verification failed. Please try again.');
        case 'verified':
            return localize('Address verification complete.');
        default:
            return localize('Upload documents to verify your address.');
    }
};

const Verification = () => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const { data, isLoading } = usePoiPoaStatus();
    const { isP2PPoaRequired, isPoaPending, isPoaVerified, isPoiPending, isPoiVerified, poaStatus, poiStatus } =
        data || {};

    const redirectToVerification = (route: string) => {
        const search = window.location.search;
        let updatedUrl = `${route}?ext_platform_url=/p2p`;

        if (search) {
            const urlParams = new URLSearchParams(search);
            const updatedUrlParams = new URLSearchParams(updatedUrl);
            urlParams.forEach((value, key) => updatedUrlParams.append(key, value));
            updatedUrl = `${updatedUrl}&${urlParams.toString()}`;
        }

        window.location.href = updatedUrl;
    };

    const checklistItems = [
        {
            isDisabled: isPoiPending,
            onClick: () => {
                if (!isPoiVerified)
                    redirectToVerification(`${URLConstants.derivAppProduction}/account/proof-of-identity`);
            },
            status: isPoiVerified ? 'done' : 'action',
            testId: 'dt_verification_poi_arrow_button',
            text: getPoiAction(poiStatus, localize),
        },
        ...(isP2PPoaRequired
            ? [
                  {
                      isDisabled: isPoaPending,
                      onClick: () => {
                          if (!isPoaVerified)
                              redirectToVerification(`${URLConstants.derivAppProduction}/account/proof-of-address`);
                      },
                      status: isPoaVerified ? 'done' : 'action',
                      testId: 'dt_verification_poa_arrow_button',
                      text: getPoaAction(poaStatus, localize),
                  },
              ]
            : []),
    ];

    if (isLoading) return <Loader />;

    return (
        <div className='verification'>
            <DerivLightIcCashierSendEmailIcon className='verification__icon' height={128} width={128} />
            <Text className='verification__text' size={isMobile ? 'lg' : 'md'} weight='bold'>
                <Localize i18n_default_text='Verify your P2P account' />
            </Text>
            <Text align='center' className='verification__text' size={isMobile ? 'lg' : 'sm'}>
                <Localize i18n_default_text='Verify your identity and address to use Deriv P2P.' />
            </Text>
            <Checklist items={checklistItems} />
        </div>
    );
};

export default Verification;
