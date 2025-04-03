import React from 'react';
import { LegacyCalendarPrevious1pxIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import Button from './CalendarButton';

type TFooterProps = {
    clearText?: string;
    footer?: string;
    hasClearBtn?: boolean;
    hasTodayBtn?: boolean;
    onClear?: React.MouseEventHandler<HTMLSpanElement>;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
    useIcon?: React.ReactNode;
};

const FooterIcon = (useIcon?: React.ReactNode) => useIcon || <LegacyCalendarPrevious1pxIcon height={16} width={16} />;

const Footer = ({ clearText, footer, hasClearBtn, hasTodayBtn, onClear, onClick, useIcon }: TFooterProps) => (
    <React.Fragment>
        {(hasTodayBtn || footer || hasClearBtn) && (
            <div className='dc-calendar__footer'>
                {footer && (
                    <Text align='center' size='2xs'>
                        {footer}
                    </Text>
                )}
                {hasTodayBtn && (
                    <Button className='dc-calendar__btn--today' icon={FooterIcon(useIcon)} onClick={onClick} />
                )}
                {hasClearBtn && (
                    <Button className='dc-calendar__btn' onClick={onClear} secondary small text={clearText} />
                )}
            </div>
        )}
    </React.Fragment>
);

export default Footer;
