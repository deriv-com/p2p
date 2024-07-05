import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';

type TBuySellFormFooterProps = {
    isDisabled: boolean;
    onClickCancel: () => void;
    onSubmit?: () => void;
};
const BuySellFormFooter = ({ isDisabled, onClickCancel, onSubmit }: TBuySellFormFooterProps) => {
    const { isDesktop } = useDevice();
    return (
        <div className='flex justify-end gap-[1rem]'>
            <Button
                className='border-2'
                color='black'
                onClick={onClickCancel}
                size='lg'
                textSize={isDesktop ? 'sm' : 'md'}
                variant='outlined'
            >
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button
                disabled={isDisabled}
                onClick={() => onSubmit?.()}
                size='lg'
                textSize={isDesktop ? 'sm' : 'md'}
                type='submit'
            >
                <Localize i18n_default_text='Confirm' />
            </Button>
        </div>
    );
};

export default BuySellFormFooter;
