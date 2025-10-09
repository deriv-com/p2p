import { ReactNode } from 'react';
import { TLocalize } from 'types';
import { DERIV_APP } from '@/constants';
import {
    LegacyCashierIcon as CashierLogo,
    LegacyHomeOldIcon as TradershubLogo,
    LegacyReportsIcon as ReportsLogo,
} from '@deriv/quill-icons';

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
        href: DERIV_APP,
        icon: <TradershubLogo iconSize='xs' />,
        label: localize("Trader's Hub"),
        name: "Trader's Hub",
    },
    {
        as: 'a',
        href: `${DERIV_APP}/reports`,
        icon: <ReportsLogo iconSize='xs' />,
        label: localize('Reports'),
        name: 'Reports',
    },
    {
        as: 'a',
        href: `${DERIV_APP}/cashier`,
        icon: <CashierLogo iconSize='xs' />,
        label: localize('Cashier'),
        name: 'Cashier',
    },
];
