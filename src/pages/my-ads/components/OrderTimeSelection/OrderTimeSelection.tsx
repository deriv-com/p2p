import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MutableOption } from 'types';
import { OrderTimeTooltipModal } from '@/components/Modals';
import { getOrderTimeCompletionList, getOrderTimeInfoMessage } from '@/constants';
import { LabelPairedChevronDownMdRegularIcon, LabelPairedCircleInfoCaptionRegularIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Dropdown, Text, Tooltip, useDevice } from '@deriv-com/ui';

const OrderTimeSelection = () => {
    const { control } = useFormContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    return (
        <div className='my-4'>
            <div className='flex items-center gap-[0.8rem]'>
                <Text color='prominent' size={isMobile ? 'md' : 'sm'}>
                    <Localize i18n_default_text='Orders must be completed in' />
                </Text>
                <Text size='xs'>
                    <Tooltip className='max-w-none' message={getOrderTimeInfoMessage(localize)} position='top'>
                        <Button
                            color='white'
                            onClick={isMobile ? () => setIsModalOpen(true) : () => undefined}
                            type='button'
                            variant='contained'
                        >
                            <LabelPairedCircleInfoCaptionRegularIcon
                                data-testid='dt_order_info_icon'
                                height={24}
                                width={24}
                            />
                        </Button>
                    </Tooltip>
                </Text>
            </div>
            <Controller
                control={control}
                name='order-completion-time'
                render={({ field: { onChange, value } }) => (
                    <Dropdown
                        className='items-center h-16'
                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                        list={getOrderTimeCompletionList(localize) as unknown as MutableOption[]}
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
