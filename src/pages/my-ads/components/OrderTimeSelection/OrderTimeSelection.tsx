import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TOrderExpiryOptions } from 'types';
import { OrderTimeTooltipModal } from '@/components/Modals';
import { TooltipMenuIcon } from '@/components/TooltipMenuIcon';
import { getOrderTimeInfoMessage } from '@/constants';
import { formatTime, getOrderTimeCompletionList } from '@/utils';
import { LabelPairedChevronDownMdRegularIcon, LabelPairedCircleInfoCaptionRegularIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Dropdown, Text, useDevice } from '@deriv-com/ui';
import './OrderTimeSelection.scss';

const OrderTimeSelection = ({ orderExpiryOptions }: { orderExpiryOptions: TOrderExpiryOptions }) => {
    const { control, getValues, setValue } = useFormContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    // remove the existing selection from input field if the existing value is not present in the dropdown
    useEffect(() => {
        if (
            orderExpiryOptions &&
            !orderExpiryOptions.find(option => option === Number(getValues('order-completion-time'))) &&
            getValues('form-type') !== 'edit'
        ) {
            setValue('order-completion-time', `${Math.max(...(orderExpiryOptions as number[]))}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderExpiryOptions]);

    const getOptions = () => {
        const options = getOrderTimeCompletionList(localize, orderExpiryOptions);
        if (
            getValues('form-type') === 'edit' &&
            !options.some(option => option.value === getValues('order-completion-time'))
        )
            return [
                {
                    text: formatTime(Number(getValues('order-completion-time')), localize),
                    value: getValues('order-completion-time'),
                },
                ...options,
            ];
        return options;
    };

    return (
        <div className='order-time-selection'>
            <div className='flex items-center gap-[0.8rem]'>
                <Text color='prominent' size={isDesktop ? 'sm' : 'md'}>
                    <Localize i18n_default_text='Orders must be completed in' />
                </Text>
                <Text size='xs'>
                    <TooltipMenuIcon
                        as='button'
                        disableHover
                        onClick={isDesktop ? () => undefined : () => setIsModalOpen(true)}
                        tooltipContent={getOrderTimeInfoMessage(localize)}
                        type='button'
                    >
                        <LabelPairedCircleInfoCaptionRegularIcon
                            data-testid='dt_order_info_icon'
                            height={24}
                            width={24}
                        />
                    </TooltipMenuIcon>
                </Text>
            </div>
            <Controller
                control={control}
                name='order-completion-time'
                render={({ field: { onChange, value } }) => (
                    <Dropdown
                        className='items-center h-16'
                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                        list={getOptions()}
                        name='order-completion-time'
                        onSelect={onChange}
                        shouldClearValue
                        value={value}
                        variant='comboBox'
                    />
                )}
            />

            {isModalOpen && (
                <OrderTimeTooltipModal isModalOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default OrderTimeSelection;
