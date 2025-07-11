import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';

type TAddNewButtonProps = {
    isDisabled: boolean;
    isMobile: boolean;
    onAdd: () => void;
};

/**
 * @component This component is used to display the add new button
 * @param isDisabled - Whether the button is disabled or not
 * @param isMobile - Whether the current device is mobile or not
 * @param onAdd - The function to be called when the button is clicked
 * @returns {JSX.Element}
 * @example <AddNewButton isDisabled={false} isMobile={isMobile} onAdd={onAdd} />
 * **/
const AddNewButton = ({ isDisabled, isMobile, onAdd }: TAddNewButtonProps) => (
    <Button
        disabled={isDisabled}
        isFullWidth={isMobile}
        onClick={() => onAdd()}
        size='lg'
        textSize={isMobile ? 'md' : 'sm'}
    >
        <Localize i18n_default_text='Add a payment method' />
    </Button>
);

export default AddNewButton;
