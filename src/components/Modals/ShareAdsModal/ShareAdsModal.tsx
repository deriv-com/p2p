import { MouseEvent, useEffect, useRef } from 'react';
import { Clipboard } from '@/components';
import { ADVERTISER_URL, BUY_SELL, RATE_TYPE } from '@/constants';
import { api } from '@/hooks';
import { useCopyToClipboard } from '@/hooks/custom-hooks';
import { LegacyShare1pxIcon, LegacyShareLink1pxIcon, LegacyWonIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Divider, Modal, Text, useDevice } from '@deriv-com/ui';
import ShareMyAdsCard from './ShareAdsCard';
import ShareMyAdsSocials from './ShareAdsSocials';
import './ShareAdsModal.scss';

type TShareAdsModalProps = {
    id: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const websiteUrl = () => `${location.protocol}//${location.hostname}`;

const ShareAdsModal = ({ id, isModalOpen, onRequestClose }: TShareAdsModalProps) => {
    const { localize } = useTranslations();
    const timeoutClipboardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isDesktop } = useDevice();
    const { data: advertInfo, isLoading: isLoadingInfo } = api.advert.useGet({ id });
    const [isCopied, copyToClipboard, setIsCopied] = useCopyToClipboard();
    const {
        account_currency: accountCurrency,
        advertiser_details: advertiserDetails,
        local_currency: localCurrency,
        rate_display: rateDisplay,
        rate_type: rateType,
        type,
    } = advertInfo ?? {};
    const { id: advertiserId } = advertiserDetails ?? {};

    const divRef = useRef<HTMLDivElement | null>(null);
    const advertUrl = `${websiteUrl()}${ADVERTISER_URL}/${advertiserId}?advert_id=${id}&currency=${localCurrency}`;
    const isBuyAd = type === BUY_SELL.BUY;
    const firstCurrency = isBuyAd ? localCurrency : accountCurrency;
    const secondCurrency = isBuyAd ? accountCurrency : localCurrency;
    const adRateType = rateType === RATE_TYPE.FLOAT ? '%' : ` ${localCurrency}`;
    const customMessage = localize(
        "Hi! I'd like to exchange {{firstCurrency}} for {{secondCurrency}} at {{rateDisplay}}{{adRateType}} on Deriv P2P.\n\nIf you're interested, check out my ad 👉\n\n{{advertUrl}}\n\nThanks!",
        {
            adRateType,
            advertUrl,
            firstCurrency,
            rateDisplay,
            secondCurrency,
        }
    );

    const onCopy = (event: MouseEvent) => {
        copyToClipboard(advertUrl);
        setIsCopied(true);
        timeoutClipboardRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
        event.stopPropagation();
    };

    const handleGenerateImage = async () => {
        if (divRef.current) {
            const p2pLogo = divRef.current.querySelector('.share-ads-card__qr-icon');
            if (p2pLogo) {
                const { default: html2canvas } = await import('html2canvas');
                const canvas = await html2canvas(divRef.current, { allowTaint: true, useCORS: true });
                const screenshot = canvas.toDataURL('image/png', 1.0);
                const fileName = `${type}_${id}.png`;
                const link = document.createElement('a');
                link.download = fileName;
                link.href = screenshot;
                link.click();
            }
        }
    };

    const handleShareLink = () => {
        navigator.share({
            text: customMessage,
        });
    };

    useEffect(() => {
        return () => {
            if (timeoutClipboardRef.current) {
                clearTimeout(timeoutClipboardRef.current);
            }
        };
    }, []);

    return (
        <>
            {!isLoadingInfo && (
                <Modal
                    ariaHideApp={false}
                    className='share-ads-modal'
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    testId='dt_share_ads_modal'
                >
                    <Modal.Header className='px-0 py-4 lg:pb-16 h-0' hideBorder onRequestClose={onRequestClose}>
                        <Text weight='bold'>
                            <Localize i18n_default_text='Share this ad' />
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        {isDesktop && (
                            <Text>
                                <Localize i18n_default_text='Promote your ad by sharing the QR code and link.' />
                            </Text>
                        )}
                        <div className='share-ads-modal__container'>
                            <div className='share-ads-modal__container__card'>
                                <ShareMyAdsCard advert={advertInfo} advertUrl={advertUrl} ref={divRef} />
                                <Button
                                    className='border-[1px]'
                                    color='black'
                                    isFullWidth={!isDesktop}
                                    onClick={handleGenerateImage}
                                    textSize={isDesktop ? 'sm' : 'md'}
                                    variant='outlined'
                                >
                                    <Localize i18n_default_text='Download this QR code' />
                                </Button>
                                {!isDesktop && (
                                    <div className='flex w-full gap-4 justify-between mt-6'>
                                        <Button
                                            className='share-ads-modal__container__card__button'
                                            color='black'
                                            onClick={handleShareLink}
                                            textSize='md'
                                            variant='outlined'
                                        >
                                            <LegacyShare1pxIcon iconSize='xs' />
                                            <Localize i18n_default_text='Share link' />
                                        </Button>
                                        <Button
                                            className='share-ads-modal__container__card__button'
                                            color='black'
                                            onClick={onCopy}
                                            textSize='md'
                                            variant='outlined'
                                        >
                                            {isCopied ? (
                                                <LegacyWonIcon iconSize='xs' />
                                            ) : (
                                                <LegacyShareLink1pxIcon iconSize='xs' />
                                            )}
                                            <Localize i18n_default_text='Copy link' />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {isDesktop && (
                                <div className='pl-[2.4rem] w-[52%]'>
                                    <Text weight='bold'>Share via</Text>
                                    <ShareMyAdsSocials advertUrl={advertUrl} customMessage={customMessage} />
                                    <Divider margin='0 0 2.5rem 0' />
                                    <Text>
                                        <Localize i18n_default_text='Or copy this link' />
                                    </Text>
                                    <div className='share-ads-modal__copy'>
                                        <Text className='share-ads-modal__copy-link' color='less-prominent' size='sm'>
                                            {advertUrl}
                                        </Text>
                                        {/* TODO: clipboard to be replaced */}
                                        <div className='share-ads-modal__copy-clipboard'>
                                            <Clipboard textCopy={advertUrl} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

export default ShareAdsModal;
