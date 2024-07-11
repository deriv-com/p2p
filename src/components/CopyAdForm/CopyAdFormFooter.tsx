import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';

type TCopyAdFormFooterProps = {
    isValid: boolean;
    onClickCancel: () => void;
    onSubmit: () => void;
};
const CopyAdFormFooter = ({ isValid, onClickCancel, onSubmit }: TCopyAdFormFooterProps) => {
    const { isDesktop } = useDevice();
    return (
        <>
            <Button
                className='border-2'
                color='black'
                onClick={onClickCancel}
                size='lg'
                textSize={isDesktop ? 'sm' : 'md'}
                type='button'
                variant='outlined'
            >
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button disabled={!isValid} onClick={onSubmit} size='lg' textSize={isDesktop ? 'sm' : 'md'}>
                <Localize i18n_default_text='Create ad' />
            </Button>
        </>
    );
};

export default CopyAdFormFooter;
