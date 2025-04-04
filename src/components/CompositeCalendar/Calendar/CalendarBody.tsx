import React from 'react';
import { CommonPropTypes } from './views/types';
import Views from './views';

type TBodyProps = CommonPropTypes & {
    calendarView: string;
    dateFormat: string;
    disabledDays?: number[];
    events?: {
        dates: string[];
        descrip: string;
    }[];
    hasRangeSelection?: boolean;
    hideOthers?: boolean;
    hoveredDate?: string | null;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
    onMouseOver?: React.MouseEventHandler<HTMLSpanElement>;
    shouldShowToday?: boolean;
    startDate?: string;
};

const Body = (props: TBodyProps) => {
    const calendarBody: Record<string, React.ReactElement> = {
        date: <Views.Days {...props} />,
        month: <Views.Months {...props} />,
        year: <Views.Years {...props} />,
        years: <Views.Decades {...props} />,
    };

    return <React.Fragment>{calendarBody[props.calendarView]}</React.Fragment>;
};

export default Body;
