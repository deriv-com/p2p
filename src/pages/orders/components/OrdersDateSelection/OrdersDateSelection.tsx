import { Dispatch, SetStateAction, useState } from 'react';
import { DatePicker } from '@/components';
import { LabelPairedCalendarRangeMdRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Input, useDevice } from '@deriv-com/ui';
import { OrdersDateSelectionFullPage } from '../OrdersDateSelectionFullPage';
import './OrdersDateSelection.scss';

type TOrdersDateSelectionProps = {
    fromDate: string | null;
    setFromDate: Dispatch<SetStateAction<string | null>>;
    setToDate: Dispatch<SetStateAction<string | null>>;
    toDate: string | null;
};

const OrdersDateSelection = ({ fromDate, setFromDate, setToDate, toDate }: TOrdersDateSelectionProps) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const [isDateSelectionOpen, setIsDateSelectionOpen] = useState(false);

    if (!isDesktop) {
        return (
            <div className='orders-date-selection'>
                <Input
                    className='orders-date-selection__input'
                    islabelAnimationDisabled
                    label={localize('All time')}
                    leftPlaceholder={<LabelPairedCalendarRangeMdRegularIcon />}
                    onClick={() => setIsDateSelectionOpen(true)}
                    readOnly
                    value={fromDate && toDate ? `${fromDate} - ${toDate}` : localize('All time')}
                />
                {isDateSelectionOpen && (
                    <OrdersDateSelectionFullPage
                        fromDate={fromDate}
                        onClickCancel={() => setIsDateSelectionOpen(false)}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                        toDate={toDate}
                    />
                )}
            </div>
        );
    }

    return (
        <div className='orders-date-selection'>
            <DatePicker
                label={localize('Date from')}
                maxDate={toDate ? new Date(toDate) : new Date()}
                name='from-date'
                onDateChange={setFromDate}
                showLabel
                value={fromDate || ''}
            />
            <DatePicker
                label={localize('Today')}
                maxDate={new Date()}
                minDate={fromDate ? new Date(fromDate) : undefined}
                name='to-date'
                onDateChange={setToDate}
                rightAlignment
                value={toDate || ''}
            />
        </div>
    );
};

export default OrdersDateSelection;
