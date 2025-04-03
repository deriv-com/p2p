export type CommonPropTypes = {
    calendarDate: moment.MomentInput;
    isPeriodDisabled: (date: moment.Moment, unit: moment.unitOfTime.StartOf) => boolean;
    selectedDate: moment.MomentInput;
    updateSelected: (e: React.MouseEvent<HTMLSpanElement>, type: moment.unitOfTime.StartOf) => void;
};
