import { THooks, TPaymentMethod } from 'types';
import {
    getPaymentMethodObjects,
    sortPaymentMethods,
    sortPaymentMethodsWithAvailability,
    TGetPaymentMethodObjects,
} from '../payment-methods';

type TSortPaymentMethodsList = (TPaymentMethod & { isAvailable?: boolean })[];

describe('payment-methods', () => {
    describe('getPaymentMethodObjects', () => {
        it('should return an object with payment methods as keys', () => {
            const paymentMethods = [
                { display_name: 'Bank Transfer', id: '1' },
                { display_name: 'Alipay', id: '2' },
            ];
            const result = getPaymentMethodObjects(paymentMethods as TGetPaymentMethodObjects);
            expect(result).toEqual({
                Alipay: { display_name: 'Alipay', id: '2' },
                'Bank Transfer': { display_name: 'Bank Transfer', id: '1' },
            });
        });

        it('should return an empty object if the paymentMethodsList is empty', () => {
            const paymentMethods: TGetPaymentMethodObjects = [];
            const result = getPaymentMethodObjects(paymentMethods);
            expect(result).toEqual({});
        });

        it('should return an empty object if paymentMethodsList is undefined', () => {
            // @ts-expect-error - Testing for undefined
            const result = getPaymentMethodObjects(undefined);
            expect(result).toEqual({});
        });
    });

    describe('sortPaymentMethods', () => {
        it('should sort the payment methods based on their order', () => {
            const paymentMethods = [{ method: 'bank_transfer' }, { method: 'other' }, { method: 'alipay' }];
            const result = sortPaymentMethods(paymentMethods as THooks.AdvertiserPaymentMethods.Get);
            expect(result).toEqual([{ method: 'bank_transfer' }, { method: 'alipay' }, { method: 'other' }]);
        });
    });

    describe('sortPaymentMethodsWithAvailability', () => {
        it('should sort the payment methods based on their availability', () => {
            const paymentMethods = [
                { isAvailable: false, method: 'bank_transfer' },
                { isAvailable: true, method: 'alipay' },
            ];
            const result = sortPaymentMethodsWithAvailability(paymentMethods as unknown as TSortPaymentMethodsList);
            expect(result).toEqual([
                { isAvailable: true, method: 'alipay' },
                { isAvailable: false, method: 'bank_transfer' },
            ]);
        });
    });
});
