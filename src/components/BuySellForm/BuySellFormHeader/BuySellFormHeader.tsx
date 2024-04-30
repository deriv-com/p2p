import { Text } from '@deriv-com/ui';

type TBuySellFormHeaderProps = {
    currency?: string;
    isBuy: boolean;
};

const BuySellFormHeader = ({ currency = '', isBuy }: TBuySellFormHeaderProps) => {
    return (
        <Text size='md' weight='bold'>
            {`${isBuy ? 'Sell' : 'Buy'} ${currency}`}
        </Text>
    );
};

export default BuySellFormHeader;
