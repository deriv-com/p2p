import moment, { Duration } from 'moment';
import { TLocalize } from 'types';
import { epochToMoment, toMoment } from './time';

/**
 * return moment duration between two dates
 * @param  {Number} epoch start time
 * @param  {Number} epoch end time
 * @return {moment.duration} moment duration between start time and end time
 */
export const getDiffDuration = (startTime: number, endTime: number): Duration =>
    moment.duration(moment.unix(endTime).diff(moment.unix(startTime)));

const getStatusLabel = (diff: Duration, localize: TLocalize) => {
    if (diff.years()) return localize('Seen more than 6 months ago');

    if (diff.months()) {
        if (diff.months() > 6) {
            return localize('Seen more than 6 months ago');
        }
        if (diff.months() === 1) {
            return localize('Seen 1 month ago');
        }
        return localize('Seen {{diff}} months ago', { diff: diff.months() });
    }
    if (diff.days()) {
        if (diff.days() === 1) {
            return localize('Seen 1 day ago');
        }
        return localize('Seen {{days}} days ago', { days: diff.days() });
    }
    if (diff.hours()) {
        if (diff.hours() === 1) {
            return localize('Seen 1 hour ago');
        }
        return localize('Seen {{hours}} hours ago', { hours: diff.hours() });
    }
    if (diff.minutes()) {
        if (diff.minutes() === 1) {
            return localize('Seen 1 minute ago');
        }
        return localize('Seen {{dif}} minutes ago', { dif: diff.minutes() });
    }
    return localize('Online');
};

const getTimeDifference = (lastSeenOnline: number) => {
    const startTime = epochToMoment(lastSeenOnline).unix();
    const endTime = toMoment().unix();
    return getDiffDuration(startTime, endTime);
};

/**
 * Function to generate the status label for the user based on the given online status and last online time.
 *
 * @param {boolean} isOnline - The online status of the user
 * @param {number} lastOnlineTime - The last online time in epoch
 * @returns {string} The status label to be shown.
 */
export const getLastOnlineLabel = (isOnline: boolean, localize: TLocalize, lastOnlineTime?: number): string => {
    if (!isOnline) {
        if (lastOnlineTime) {
            const diff = getTimeDifference(lastOnlineTime);
            return getStatusLabel(diff, localize);
        }
        return localize('Seen more than 6 months ago');
    }
    return localize('Online');
};
