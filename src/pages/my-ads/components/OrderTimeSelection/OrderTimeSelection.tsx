import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TOrderExpiryOptions } from 'types';
import { OrderTimeTooltipModal } from '@/components/Modals';
import { getOrderTimeInfoMessage } from '@/constants';
import { getOrderTimeCompletionList } from '@/utils';
import { LabelPairedChevronDownMdRegularIcon, LabelPairedCircleInfoCaptionRegularIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Dropdown, Text, TooltipMenuIcon, useDevice } from '@deriv-com/ui';
import './OrderTimeSelection.scss';

const OrderTimeSelection = ({ orderExpiryOptions }: { orderExpiryOptions: TOrderExpiryOptions }) => {
    const { control } = useFormContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    return (
        <div className='order-time-selection'>
            <div className='flex items-center gap-[0.8rem]'>
                <Text color='prominent' size={isMobile ? 'md' : 'sm'}>
                    <Localize i18n_default_text='Orders must be completed in' />
                </Text>
                <Text size='xs'>
                    <TooltipMenuIcon
                        as='button'
                        disableHover
                        onClick={isMobile ? () => setIsModalOpen(true) : () => undefined}
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
                        list={getOrderTimeCompletionList(localize, orderExpiryOptions)}
                        name='order-completion-time'
                        onSelect={onChange}
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
