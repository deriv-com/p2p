import { TLocalize } from 'types';

/**
 * The below function is a temporary solution to get handle the tab switching when switching the language.
 * @returns the localized tabs based on the current language.
 */
export const getLocalizedTabs = (localize: TLocalize): { [tab: string]: string } => ({
    'Active orders': localize('Active orders'),
    'Ad details': localize('Ad details'),
    Buy: localize('Buy'),
    'My counterparties': localize('My counterparties'),
    'Past orders': localize('Past orders'),
    'Payment methods': localize('Payment methods'),
    Sell: localize('Sell'),
    Stats: localize('Stats'),
});
