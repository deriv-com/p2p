import { Dispatch, SetStateAction, useState } from 'react';
import { DatePicker, FullPageMobileWrapper } from '@/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import './OrdersDateSelectionFullPage.scss';

type TOrdersDateSelectionFullPageProps = {
    fromDate: string | null;
    onClickCancel: () => void;
    setFromDate: Dispatch<SetStateAction<string | null>>;
    setToDate: Dispatch<SetStateAction<string | null>>;
    toDate: string | null;
};

const OrdersDateSelectionFullPage = ({
    fromDate,
    onClickCancel,
    setFromDate,
    setToDate,
    toDate,
}: TOrdersDateSelectionFullPageProps) => {
    const { localize } = useTranslations();
    const [startDate, setStartDate] = useState<string | null>(fromDate);
    const [endDate, setEndDate] = useState<string | null>(toDate);

    return (
        <FullPageMobileWrapper
            className='orders-date-selection-full-page'
            onBack={onClickCancel}
            renderFooter={() => (
                <div className='flex gap-[1.6rem]'>
                    <Button
                        className='w-full border-2'
                        color='black'
                        onClick={onClickCancel}
                        size='lg'
                        textSize='md'
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button
                        className='w-full'
                        disabled={!startDate || !endDate}
                        onClick={() => {
                            startDate && setFromDate(startDate);
                            endDate && setToDate(endDate);
                            onClickCancel();
                        }}
                        size='lg'
                        textSize='md'
                    >
                        <Localize i18n_default_text='OK' />
                    </Button>
                </div>
            )}
            renderHeader={() => (
                <Text weight='bold'>
                    <Localize i18n_default_text='Please select duration' />
                </Text>
            )}
            shouldShowBackIcon={false}
            shouldShowCloseIcon
        >
            <DatePicker
                alignedRight
                label={localize('Start date')}
                maxDate={endDate ? new Date(endDate) : new Date()}
                name='from-date'
                onDateChange={setStartDate}
                showLabel
                value={fromDate || ''}
            />
            <DatePicker
                alignedRight
                label={localize('End date')}
                maxDate={new Date()}
                minDate={startDate ? new Date(startDate) : undefined}
                name='to-date'
                onDateChange={setEndDate}
                showLabel
                value={toDate || ''}
            />
        </FullPageMobileWrapper>
    );
};

export default OrdersDateSelectionFullPage;
