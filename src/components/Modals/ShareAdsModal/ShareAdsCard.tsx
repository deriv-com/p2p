import { ForwardedRef, forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { THooks } from 'types';
import { ADVERT_TYPE, BUY_SELL, p2pLogo, RATE_TYPE } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './ShareAdsCard.scss';

type TShareMyAdsCardProps = {
    advert?: Partial<THooks.Advert.Get>;
    advertUrl: string;
};

const ShareMyAdsCard = forwardRef(
    ({ advert = {}, advertUrl }: TShareMyAdsCardProps, ref: ForwardedRef<HTMLDivElement>) => {
        const { isDesktop } = useDevice();
        const {
            account_currency: accountCurrency,
            id,
            local_currency: localCurrency,
            max_order_amount_limit_display: maxOrderAmountLimitDisplay,
            min_order_amount_limit_display: minOrderAmountLimitDisplay,
            rate_display: rateDisplay,
            rate_type: rateType,
            type,
        } = advert;

        const advertType = type === BUY_SELL.BUY ? ADVERT_TYPE.BUY : ADVERT_TYPE.SELL;
        const textSize = isDesktop ? 'sm' : 'md';

        return (
            <div className='flex flex-col justify-center relative share-ads-card' ref={ref}>
                <img alt='deriv_p2p' className='share-ads-card__icon' src={p2pLogo.deriv_p2p} />
                <Text className='share-ads-card__title' size={isDesktop ? 'xl' : '2xl'} weight='bold'>
                    {advertType} {accountCurrency}
                </Text>
                <div className='flex flex-row share-ads-card__numbers'>
                    <div className='flex flex-col share-ads-card__numbers-text'>
                        <Text color='white' size={textSize}>
                            <Localize i18n_default_text='ID number' />
                        </Text>
                        <Text color='white' size={textSize}>
                            <Localize i18n_default_text='Limits' />
                        </Text>
                        <Text color='white' size={textSize}>
                            <Localize i18n_default_text='Rate' />
                        </Text>
                    </div>
                    <div className='flex flex-col share-ads-card__numbers-text'>
                        <Text color='white' size={textSize} weight='bold'>
                            {id}
                        </Text>
                        <Text color='white' size={textSize} weight='bold'>
                            {minOrderAmountLimitDisplay} - {maxOrderAmountLimitDisplay} {accountCurrency}
                        </Text>
                        <Text color='white' size={textSize} weight='bold'>
                            {rateDisplay}
                            {rateType === RATE_TYPE.FIXED ? ` ${localCurrency}` : '%'}
                        </Text>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center share-ads-card__qr'>
                    <div className='flex items-center justify-center relative share-ads-card__qr-container'>
                        <QRCodeSVG
                            imageSettings={{
                                excavate: true,
                                height: 25,
                                src: '',
                                width: 25,
                            }}
                            size={isDesktop ? 140 : 120}
                            value={advertUrl}
                        />
                        <img
                            alt='dp2p_logo'
                            className='absolute share-ads-card__qr-icon'
                            height='25'
                            src={p2pLogo.dp2p_logo}
                            width='25'
                        />
                    </div>
                    <Text className='share-ads-card__qr-text' color='less-prominent' size='xs'>
                        <Localize i18n_default_text='Scan this code to order via Deriv P2P' />
                    </Text>
                </div>
            </div>
        );
    }
);

ShareMyAdsCard.displayName = 'ShareMyAdsCard';
export default ShareMyAdsCard;
