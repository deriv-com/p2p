import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

type TBuySellFormHeaderProps = {
    currency?: string;
    isBuy: boolean;
};

const BuySellFormHeader = ({ currency = '', isBuy }: TBuySellFormHeaderProps) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    return (
        <Text size={isMobile ? 'lg' : 'md'} weight='bold'>
            {`${isBuy ? localize('Sell') : localize('Buy')} ${currency}`}
        </Text>
    );
};

export default BuySellFormHeader;
