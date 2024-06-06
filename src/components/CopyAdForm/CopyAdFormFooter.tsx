import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';

type TCopyAdFormFooterProps = {
    onRequestClose: () => void;
};
const CopyAdFormFooter = ({ onRequestClose }: TCopyAdFormFooterProps) => {
    return (
        <>
            <Button
                className='border-2'
                color='black'
                onClick={onRequestClose}
                size='lg'
                textSize='sm'
                variant='outlined'
            >
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button size='lg' textSize='sm'>
                <Localize i18n_default_text='Create ad' />
            </Button>
        </>
    );
};

export default CopyAdFormFooter;
