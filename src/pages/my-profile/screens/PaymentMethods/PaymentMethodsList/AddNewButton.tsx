import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';

type TAddNewButtonProps = {
    isMobile: boolean;
    onAdd: () => void;
};

/**
 * @component This component is used to display the add new button
 * @param isMobile - Whether the current device is mobile or not
 * @param onAdd - The function to be called when the button is clicked
 * @returns {JSX.Element}
 * @example <AddNewButton isMobile={isMobile} onAdd={onAdd} />
 * **/
const AddNewButton = ({ isMobile, onAdd }: TAddNewButtonProps) => (
    <Button isFullWidth={isMobile} onClick={() => onAdd()} size='lg' textSize={isMobile ? 'md' : 'sm'}>
        <Localize i18n_default_text='Add new' />
    </Button>
);

export default AddNewButton;
