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
        return localize("We're unable to complete this action because this user is no longer active on Deriv P2P.");
    }

    return error?.message;
};

export const getInvalidIDTitle = (error: TError, localize: TLocalize) => {
    if (error?.code === ERROR_CODES.INVALID_ADVERTISER_ID) {
        return localize('User unavailable');
    }

    return undefined;
};
