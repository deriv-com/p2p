/* eslint-disable sort-keys */
import { ReactNode } from 'react';
import {
    CurrencyBtcIcon,
    CurrencyDemoIcon,
    CurrencyEthIcon,
    CurrencyUsdIcon,
    CurrencyUsdtIcon,
    DerivProductDerivBotBrandLightLogoWordmarkHorizontalIcon as DerivBotLogo,
    DerivProductDerivTraderBrandLightLogoWordmarkHorizontalIcon as DerivTraderLogo,
    LabelPairedHouseBlankMdRegularIcon as TradershubLogo,
    LegacyCashierIcon as CashierLogo,
    LegacyReportsIcon as ReportsLogo,
    PartnersProductBinaryBotBrandLightLogoWordmarkHorizontalIcon as BinaryBotLogo,
    PartnersProductSmarttraderBrandLightLogoWordmarkIcon as SmarttraderLogo,
} from '@deriv/quill-icons';

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

export const platformsConfig: PlatformsConfig[] = [
    {
        active: true,
        buttonIcon: <DerivTraderLogo height={25} width={114.97} />,
        href: 'https://app.deriv.com',
        showInEU: true,
        description: 'A whole new trading experience on a powerful yet easy to use platform.',
        icon: <DerivTraderLogo height={32} width={148} />,
    },
    {
        href: 'https://app.deriv.com/bot',
        showInEU: false,
        active: false,
        description: 'Automated trading at your fingertips. No coding needed.',
        icon: <DerivBotLogo height={32} width={121} />,
        buttonIcon: <DerivBotLogo height={24} width={91} />,
    },
    {
        href: 'https://smarttrader.deriv.com/en/trading',
        showInEU: false,
        active: false,
        description: 'Trade the world’s markets with our popular user-friendly platform.',
        icon: <SmarttraderLogo height={32} width={153} />,
        buttonIcon: <SmarttraderLogo height={24} width={115} />,
    },
    {
        href: 'https://bot.deriv.com',
        showInEU: false,
        active: false,
        description:
            'Our classic “drag-and-drop” tool for creating trading bots, featuring pop-up trading charts, for advanced users.',
        icon: <BinaryBotLogo height={32} width={133} />,
        buttonIcon: <BinaryBotLogo height={24} width={100} />,
    },
];

export const MenuItems: MenuItemsConfig[] = [
    {
        as: 'a',
        href: 'https://app.deriv.com/appstore/traders-hub',
        icon: <TradershubLogo />,
        label: "Trader's Hub",
    },
    {
        as: 'button',
        href: 'https://app.deriv.com/appstore/traders-hub',
        icon: <ReportsLogo iconSize='xs' />,
        label: `Reports`,
    },
    {
        as: 'button',
        href: 'https://app.deriv.com/appstore/traders-hub',
        icon: <CashierLogo iconSize='xs' />,
        label: `Cashier`,
    },
];

export const accountsList: TAccount[] = [
    {
        icon: <CurrencyUsdIcon />,
        type: 'US Dollar',
        loginid: 'id1',
        balance: '1000',
        currency: 'USD',
        token: 'token1',
        isVirtual: true,
        isEu: true,
        isActive: false,
    },
    {
        icon: <CurrencyBtcIcon />,
        type: 'Bitcoin',
        loginid: 'id2',
        balance: '0.00054',
        currency: 'BTC',
        token: 'token2',
        isVirtual: false,
        isEu: false,
        isActive: true,
    },
    {
        icon: <CurrencyDemoIcon />,
        type: 'US Dollar',
        loginid: 'id3',
        balance: '10000',
        currency: 'USD',
        token: 'token3',
        isVirtual: false,
        isEu: false,
        isActive: false,
    },
    {
        icon: <CurrencyUsdtIcon />,
        type: 'Tether TRC20',
        loginid: 'id4',
        balance: '500',
        currency: 'USD',
        token: 'token4',
        isVirtual: false,
        isEu: true,
        isActive: false,
    },
    {
        icon: <CurrencyEthIcon />,
        type: 'Etherium',
        loginid: 'id5',
        balance: '1000',
        currency: 'ETH',
        token: 'token5',
        isVirtual: false,
        isEu: true,
        isActive: false,
    },
];
