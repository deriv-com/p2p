import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';

type TBusinessHoursModalFooterProps = {
    showEdit: boolean;
};

const BusinessHourModalHeader = ({ showEdit }: TBusinessHoursModalFooterProps) => {
    if (showEdit) {
        return (
            <Text weight='bold'>
                <Localize i18n_default_text='Edit business hours' />
            </Text>
        );
    }

    return (
        <Text weight='bold'>
            <Localize i18n_default_text='Business hours' />
        </Text>
    );
};

export default BusinessHourModalHeader;
