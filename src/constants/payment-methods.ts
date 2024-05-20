import { TLocalize } from 'types';

export const getPaymentMethodCategories = (localize: TLocalize) => ({
    bank: localize('Bank Transfers'),
    ewallet: localize('E-wallets'),
    other: localize('Others'),
});
