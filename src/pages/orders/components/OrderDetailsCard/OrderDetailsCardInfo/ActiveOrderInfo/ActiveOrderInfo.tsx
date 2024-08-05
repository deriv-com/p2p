import { Fragment } from 'react';
import { LightDivider } from '@/components';
import { useOrderDetails } from '@/providers/OrderDetailsProvider';
import { formatDataTestId } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import { PaymentMethodAccordion } from '../PaymentMethodAccordion';

const ActiveOrderInfo = () => {
    const { orderDetails } = useOrderDetails();
    const {
        advert_details: { description },
        contact_info: contactInfo,
        isActiveOrder,
        labels,
        payment_info: paymentInfo,
        payment_method_details: paymentMethodDetails,
    } = orderDetails;
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';

    const adDetails = [
        { text: labels.contactDetails, value: contactInfo || '-' },
        { text: labels.instructions, value: description || '-' },
    ];

    if (isActiveOrder)
        return (
            <>
                <LightDivider />
                <PaymentMethodAccordion
                    paymentDetails={labels.paymentDetails}
                    paymentInfo={paymentInfo || ''}
                    paymentMethodDetails={paymentMethodDetails}
                />
                <LightDivider />
                {adDetails.map((detail, key) => (
                    <Fragment key={detail.text}>
                        <div className='flex flex-col p-[1.6rem] gap-2'>
                            <Text size={textSize} weight='bold'>
                                {detail.text}
                            </Text>
                            <Text data-testid={`dt_${formatDataTestId(detail.text)}`} size={textSize}>
                                {detail.value}
                            </Text>
                        </div>
                        {key === 0 && <LightDivider />}
                    </Fragment>
                ))}
            </>
        );

    return null;
};

export default ActiveOrderInfo;
