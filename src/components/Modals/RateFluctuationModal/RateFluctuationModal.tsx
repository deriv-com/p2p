import { useRef } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './RateFluctuationModal.scss';

type TRateFluctuationModalProps = {
    isModalOpen: boolean;
    onContinue: () => void;
    onRequestClose: () => void;
    values: {
        currency: string;
        inputAmount: string;
        localCurrency: string;
        receivedAmount: string;
    };
};

const RateFluctuationModal = ({ isModalOpen, onContinue, onRequestClose, values }: TRateFluctuationModalProps) => {
    const { isDesktop } = useDevice();
    const buttonText = !isDesktop ? 'md' : 'sm';
    const valuesRef = useRef<TRateFluctuationModalProps['values'] | undefined>(values);

    return (
        <Modal ariaHideApp={false} className='rate-fluctuation-modal' isOpen={isModalOpen}>
            <Modal.Header className='p-0 h-fit' hideBorder hideCloseIcon>
                <Text weight='bold'>
                    <Localize i18n_default_text='Attention: Rate fluctuation' />
                </Text>
            </Modal.Header>
            <Modal.Body className='flex flex-col gap-[1.6rem] lg:gap-[2.4rem]'>
                <Text size='sm'>
                    <Localize
                        components={[<strong key={0} />, <strong key={1} />]}
                        i18n_default_text='You are creating an order to buy <0>{{currency}} {{amount}}</0> for <1>{{localCurrency}} {{receivedAmount}}</1>.'
                        values={{
                            amount: valuesRef?.current?.inputAmount,
                            currency: valuesRef?.current?.currency,
                            localCurrency: valuesRef?.current?.localCurrency,
                            receivedAmount: valuesRef?.current?.receivedAmount,
                        }}
                    />
                </Text>
                <Text size='sm'>
                    <Localize i18n_default_text='The exchange rate may vary slightly due to market fluctuations. The final rate will be shown when you proceed with your order.' />
                </Text>
                <Text size='xs'>
                    <Localize i18n_default_text='If the rate changes significantly, we may not be able to create your order.' />
                </Text>
            </Modal.Body>
            <Modal.Footer className='p-0 min-h-fit gap-[0.8rem]' hideBorder>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onRequestClose}
                    size='lg'
                    textSize={buttonText}
                    variant='outlined'
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button onClick={onContinue} size='lg' textSize={buttonText}>
                    <Localize i18n_default_text='Continue with order' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RateFluctuationModal;
