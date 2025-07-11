import { ReactNode } from 'react';
import { TLocalize } from 'types';
import {
    LegacyCashierIcon as CashierLogo,
    LegacyHomeOldIcon as TradershubLogo,
    LegacyReportsIcon as ReportsLogo,
} from '@deriv/quill-icons';
import { URLConstants } from '@deriv-com/utils';

export type MenuItemsConfig = {
    as: 'a' | 'button';
    href: string;
    icon: ReactNode;
    label: string;
    name: string;
};

export const getMenuItems = (localize: TLocalize): MenuItemsConfig[] => [
    {
        as: 'a',
        href: URLConstants.derivAppProduction,
        icon: <TradershubLogo iconSize='xs' />,
        label: localize("Trader's Hub"),
        name: "Trader's Hub",
    },
    {
        as: 'a',
        href: `${URLConstants.derivAppProduction}/reports`,
        icon: <ReportsLogo iconSize='xs' />,
        label: localize('Reports'),
        name: 'Reports',
    },
    {
        as: 'a',
        href: `${URLConstants.derivAppProduction}/cashier`,
        icon: <CashierLogo iconSize='xs' />,
        label: localize('Cashier'),
        name: 'Cashier',
    },
];
