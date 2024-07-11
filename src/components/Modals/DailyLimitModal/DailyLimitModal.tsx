import clsx from 'clsx';
import { api } from '@/hooks';
import { Localize } from '@deriv-com/translations';
import { Button, Loader, Modal, Text, useDevice } from '@deriv-com/ui';
import './DailyLimitModal.scss';

type TDailyLimitModalProps = {
    currency: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const DailyLimitModal = ({ currency, isModalOpen, onRequestClose }: TDailyLimitModalProps) => {
    const { data, error, isPending: isLoading, isSuccess, mutate } = api.advertiser.useUpdate();
    const { daily_buy_limit: dailyBuyLimit, daily_sell_limit: dailySellLimit } = data ?? {};
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    const headerTextSize = isDesktop ? 'md' : 'lg';

    const modalContent = {
        default: {
            body: (
                <Localize i18n_default_text='You won’t be able to change your buy and sell limits again after this. Do you want to continue?' />
            ),
            footer: (
                <>
                    <Button
                        className='border-2'
                        color='black'
                        onClick={onRequestClose}
                        size='lg'
                        textSize={textSize}
                        variant='outlined'
                    >
                        <Localize i18n_default_text='No' />
                    </Button>
                    <Button onClick={() => mutate({ upgrade_limits: 1 })} size='lg' textSize={textSize}>
                        <Localize i18n_default_text='Yes, continue' />
                    </Button>
                </>
            ),
            header: <Localize i18n_default_text='Are you sure?' />,
        },
        error: {
            body: (
                <Localize i18n_default_text='Sorry, we’re unable to increase your limits right now. Please try again in a few minutes.' />
            ),
            footer: (
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            ),
            header: <Localize i18n_default_text='An internal error occurred' />,
        },
        loading: {
            body: <Loader isFullScreen={false} />,
            footer: null,
            header: null,
        },
        success: {
            body: (
                <Localize
                    i18n_default_text='Your daily limits have been increased to {{dailyBuyLimit}} {{currency}} (buy) and {{dailySellLimit}} {{currency}} (sell).'
                    values={{ currency, dailyBuyLimit, dailySellLimit }}
                />
            ),
            footer: (
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            ),
            header: <Localize i18n_default_text='Success!' />,
        },
    };

    const getModalContent = () => {
        if (isLoading) {
            return modalContent.loading;
        } else if (isSuccess) {
            return modalContent.success;
        } else if (error) {
            return modalContent.error;
        }
        return modalContent.default;
    };

    return (
        <Modal
            ariaHideApp={false}
            className='daily-limit-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            testId='dt_daily_limit_modal'
        >
            {!isLoading && (
                <Modal.Header hideBorder hideCloseIcon>
                    <Text color='prominent' size={headerTextSize} weight='bold'>
                        {getModalContent().header}
                    </Text>
                </Modal.Header>
            )}
            <Modal.Body className={clsx('py-[0.8rem] px-[2.4rem]', { 'mx-auto py-[2.4rem]': isLoading })}>
                <Text size={textSize}>{getModalContent().body}</Text>
            </Modal.Body>
            {!isLoading && (
                <Modal.Footer className='gap-[0.8rem] px-[1.6rem]' hideBorder>
                    {getModalContent().footer}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default DailyLimitModal;
