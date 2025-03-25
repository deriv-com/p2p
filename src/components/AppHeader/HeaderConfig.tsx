import { ReactNode } from 'react';
import { TLocalize } from 'types';
import { LegacyHomeOldIcon as TradershubLogo } from '@deriv/quill-icons';
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
];
