import { TLocalize } from 'types';
import { ERROR_CODES } from '@/constants';

type TError =
    | {
          code: string;
          message: string;
      }
    | null
    | undefined;

export const getInvalidIDErrorMessage = (error: TError, localize: TLocalize) => {
    if (error?.code === ERROR_CODES.INVALID_ADVERTISER_ID) {
        return localize("We can't complete the action as this user is no longer active on Deriv P2P.");
    }

    return error?.message;
};

export const getInvalidIDTitle = (error: TError, localize: TLocalize) => {
    if (error?.code === ERROR_CODES.INVALID_ADVERTISER_ID) {
        return localize('User unavailable');
    }

    return undefined;
};
