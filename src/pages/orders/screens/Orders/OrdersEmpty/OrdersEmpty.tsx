import { useHistory } from 'react-router-dom';
import { BUY_SELL_URL } from '@/constants';
import { DerivLightOrderIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';

type TOrdersEmptyProps = {
    isPast?: boolean;
};

const OrdersEmpty = ({ isPast = false }: TOrdersEmptyProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'lg' : 'md';
    const history = useHistory();
    return (
        <div className='lg:p-0 py-16 px-[1.6rem]'>
            <ActionScreen
                actionButtons={
                    isPast ? undefined : (
                        <Button onClick={() => history.push(BUY_SELL_URL)} size='lg' textSize={isMobile ? 'md' : 'sm'}>
                            <Localize i18n_default_text='Buy/Sell' />
                        </Button>
                    )
                }
                icon={<DerivLightOrderIcon height='128px' width='128px' />}
                title={
                    <Text size={textSize} weight='bold'>
                        {isPast ? (
                            <Localize i18n_default_text='No orders found.' />
                        ) : (
                            <Localize i18n_default_text='You have no orders.' />
                        )}
                    </Text>
                }
            />
        </div>
    );
};

export default OrdersEmpty;
