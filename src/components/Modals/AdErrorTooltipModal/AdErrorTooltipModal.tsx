import { ReactNode } from 'react';
import { ADVERT_TYPE, ERROR_CODES } from '@/constants';
import { AdRateError } from '@/pages/my-ads/components';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './AdErrorTooltipModal.scss';

type TAdErrorTooltipModal = {
    accountCurrency: string;
    advertType: string;
    balanceAvailable: number;
    dailyBuyLimit: string;
    dailySellLimit: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
    remainingAmount: number;
    visibilityStatus: string[];
};

const getAdErrorMessage = (
    errorCode: string,
    accountCurrency: string,
    remainingAmount: number,
    balanceAvailable: number,
    advertType: string,
    dailyBuyLimit: string,
    dailySellLimit: string
): string => {
    const errorMessages: { [key: string]: ReactNode | string } = {
        [ERROR_CODES.ADVERT_INACTIVE]: <AdRateError />,
        [ERROR_CODES.ADVERT_MAX_LIMIT]: (
            <Localize
                i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than the maximum amount per order {{accountCurrency}}.'
                values={{ accountCurrency }}
            />
        ),

        [ERROR_CODES.ADVERT_MIN_LIMIT]: (
            <Localize i18n_default_text='This ad is not listed on Buy/Sell because its maximum order is lower than the minimum amount you can specify for orders in your ads.' />
        ),
        [ERROR_CODES.ADVERT_REMAINING]: (
            <Localize
                i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than the ad’s remaining amount ({{remainingAmount}} {{accountCurrency}}).'
                values={{ accountCurrency, remainingAmount }}
            />
        ),
        [ERROR_CODES.ADVERTISER_ADS_PAUSED]: (
            <Localize i18n_default_text='This ad is not listed on Buy/Sell because you have paused all your ads.' />
        ),

        [ERROR_CODES.AD_EXCEEDS_BALANCE]: (
            <Localize
                i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than your Deriv P2P available balance ({{balanceAvailable}} {{accountCurrency}}).'
                values={{ accountCurrency, balanceAvailable }}
            />
        ),
        [ERROR_CODES.AD_EXCEEDS_DAILY_LIMIT]: (
            <Localize
                i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than your remaining daily limit ({{limit}} {{accountCurrency}}).'
                values={{
                    accountCurrency,
                    limit: advertType.toLowerCase() === ADVERT_TYPE.BUY.toLowerCase() ? dailyBuyLimit : dailySellLimit,
                }}
            />
        ),
        [ERROR_CODES.ADVERTISER_TEMP_BAN]: (
            <Localize i18n_default_text='You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.' />
        ),
    };

    return (errorMessages[errorCode] as string) ?? <Localize i18n_default_text='Your ad is not listed' />;
};

const AdErrorTooltipModal = ({
    accountCurrency,
    advertType,
    balanceAvailable,
    dailyBuyLimit,
    dailySellLimit,
    isModalOpen,
    onRequestClose,
    remainingAmount,
    visibilityStatus = [],
}: TAdErrorTooltipModal) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    const getMultipleErrorMessages = (errorStatuses: string[]) =>
        errorStatuses.map((status, index) => (
            <div className='my-5' key={status}>
                {index + 1}.{' '}
                {getAdErrorMessage(
                    status,
                    accountCurrency,
                    remainingAmount,
                    balanceAvailable,
                    advertType,
                    dailyBuyLimit,
                    dailySellLimit
                )}
            </div>
        ));

    return (
        <Modal
            ariaHideApp={false}
            className='ad-error-tooltip-modal'
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Body>
                <div className='ad-error-tooltip-modal__content'>
                    <Text size={textSize}>
                        {visibilityStatus.length === 1 ? (
                            getAdErrorMessage(
                                visibilityStatus[0],
                                accountCurrency,
                                remainingAmount,
                                balanceAvailable,
                                advertType,
                                dailyBuyLimit,
                                dailySellLimit
                            )
                        ) : (
                            <>
                                <Localize i18n_default_text='Your ad isn’t listed on Buy/Sell due to the following reason(s):' />
                                {getMultipleErrorMessages(visibilityStatus)}
                            </>
                        )}
                    </Text>
                </div>
            </Modal.Body>
            <div className='flex justify-end gap-[1rem]'>
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='OK' />
                </Button>
            </div>
        </Modal>
    );
};

export default AdErrorTooltipModal;
