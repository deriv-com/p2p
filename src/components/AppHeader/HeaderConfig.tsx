import { ReactNode } from 'react';
import { TLocalize } from 'types';
import {
    DerivProductBrandLightDerivBotLogoWordmarkIcon as DerivBotLogo,
    DerivProductBrandLightDerivTraderLogoWordmarkIcon as DerivTraderLogo,
    LegacyCashierIcon as CashierLogo,
    LegacyHomeOldIcon as TradershubLogo,
    LegacyReportsIcon as ReportsLogo,
    PartnersProductBrandLightBinaryBotLogoWordmarkIcon as BinaryBotLogo,
    PartnersProductBrandLightSmarttraderLogoWordmarkIcon as SmarttraderLogo,
} from '@deriv/quill-icons';
import { URLConstants } from '@deriv-com/utils';

export type PlatformsConfig = {
    active: boolean;
    buttonIcon: ReactNode;
    description: string;
    href: string;
    icon: ReactNode;
    showInEU: boolean;
};

export type MenuItemsConfig = {
    as: 'a' | 'button';
    href: string;
    icon: ReactNode;
    label: string;
    name: string;
};

export type TAccount = {
    balance: string;
    currency: string;
    icon: React.ReactNode;
    isActive: boolean;
    isEu: boolean;
    isVirtual: boolean;
    loginid: string;
    token: string;
    type: string;
};

export const getPlatformsConfig = (localize: TLocalize): PlatformsConfig[] => [
    {
        active: true,
        buttonIcon: <DerivTraderLogo height={25} width={114.97} />,
        description: localize('A whole new trading experience on a powerful yet easy to use platform.'),
        href: `${URLConstants.derivAppProduction}/dtrader`,
        icon: <DerivTraderLogo height={32} width={148} />,
        showInEU: true,
    },
    {
        active: false,
        buttonIcon: <DerivBotLogo height={24} width={91} />,
        description: localize('Automated trading at your fingertips. No coding needed.'),
        href: `${URLConstants.derivAppProduction}/bot`,
        icon: <DerivBotLogo height={32} width={121} />,
        showInEU: false,
    },
    {
        active: false,
        buttonIcon: <SmarttraderLogo height={24} width={115} />,
        description: localize('Trade the world’s markets with our popular user-friendly platform.'),
        href: 'https://smarttrader.deriv.com/en/trading',
        icon: <SmarttraderLogo height={32} width={153} />,
        showInEU: false,
    },
    {
        active: false,
        buttonIcon: <BinaryBotLogo height={24} width={100} />,
        description: localize(
            'Our classic “drag-and-drop” tool for creating trading bots, featuring pop-up trading charts, for advanced users.'
        ),
        href: 'https://bot.deriv.com',
        icon: <BinaryBotLogo height={32} width={133} />,
        showInEU: false,
    },
];

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
