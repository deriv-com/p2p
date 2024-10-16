import { getInvalidIDErrorMessage, getInvalidIDTitle } from '../error-messages';

const mockLocalize = jest.fn(string => string);

describe('error-messages', () => {
    describe('getInvalidIDErrorMessage', () => {
        it('should return the error message for INVALID_ADVERTISER_ID', () => {
            const error = { code: 'InvalidAdvertiserID', message: 'Invalid advertiser ID' };
            const result = getInvalidIDErrorMessage(error, mockLocalize);
            expect(result).toBe("We can't complete the action as this user is no longer active on Deriv P2P.");
        });

        it('should return the error message for other errors', () => {
            const error = { code: 'SomeOtherError', message: 'Some Error' };
            const result = getInvalidIDErrorMessage(error, mockLocalize);
            expect(result).toBe('Some Error');
        });
    });

    describe('getInvalidIDTitle', () => {
        it('should return the error title for INVALID_ADVERTISER_ID', () => {
            const error = { code: 'InvalidAdvertiserID', message: 'Invalid advertiser ID' };
            const result = getInvalidIDTitle(error, mockLocalize);
            expect(result).toBe('User unavailable');
        });

        it('should return undefined for other errors', () => {
            const error = { code: 'SomeOtherError', message: 'Some Error' };
            const result = getInvalidIDTitle(error, mockLocalize);
            expect(result).toBeUndefined();
        });
    });
});
