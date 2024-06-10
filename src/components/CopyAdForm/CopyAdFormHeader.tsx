import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

const CopyAdFormHeader = () => {
    return (
        <Text weight='bold'>
            <Localize i18n_default_text='Create a similar ad' />
        </Text>
    );
};

export default CopyAdFormHeader;
