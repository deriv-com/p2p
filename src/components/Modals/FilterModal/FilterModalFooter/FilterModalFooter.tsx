import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import './FilterModalFooter.scss';

type TFilterModalFooterProps = {
    hasSameFilters: boolean;
    hasSamePaymentMethods: boolean;
    onApplyConfirm: () => void;
    onResetClear: () => void;
    paymentMethods: string[];
    showPaymentMethods: boolean;
};

const FilterModalFooter = ({
    hasSameFilters,
    hasSamePaymentMethods,
    onApplyConfirm,
    onResetClear,
    paymentMethods,
    showPaymentMethods,
}: TFilterModalFooterProps) => {
    const { isDesktop } = useDevice();

    return (
        <div className='filter-modal-footer'>
            <Button
                className='mr-[0.8rem] border-2 !border-[#999]'
                color='black'
                disabled={showPaymentMethods && paymentMethods.length === 0}
                isFullWidth={!isDesktop}
                onClick={onResetClear}
                size='lg'
                textSize={isDesktop ? 'sm' : 'md'}
                variant='outlined'
            >
                {showPaymentMethods ? <Localize i18n_default_text='Clear' /> : <Localize i18n_default_text='Reset' />}
            </Button>
            <Button
                disabled={(showPaymentMethods && hasSamePaymentMethods) || (!showPaymentMethods && hasSameFilters)}
                isFullWidth={!isDesktop}
                onClick={onApplyConfirm}
                size='lg'
                textSize={isDesktop ? 'sm' : 'md'}
            >
                {showPaymentMethods ? <Localize i18n_default_text='Confirm' /> : <Localize i18n_default_text='Apply' />}
            </Button>
        </div>
    );
};

export default FilterModalFooter;
