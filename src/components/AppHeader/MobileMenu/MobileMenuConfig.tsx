import { ReactNode } from 'react';
import { ACCOUNT_LIMITS, HELP_CENTRE, RESPONSIBLE } from '@/constants';
import {
    BrandDerivLogoCoralIcon,
    IconTypes,
    LegacyAccountLimitsIcon,
    LegacyAssessmentIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    LegacyChevronRight1pxIcon,
    LegacyDepositIcon,
    LegacyDerivP2pIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
    LegacyLiveChatOutlineIcon,
    LegacyLogout1pxIcon,
    LegacyProfileSmIcon,
    LegacyResponsibleTradingIcon,
    LegacySecurityIcon,
    LegacyTheme1pxIcon,
    LegacyTransferIcon,
    LegacyVerificationIcon,
    LegacyWhatsappIcon,
    LegacyWithdrawalIcon,
} from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { ToggleSwitch } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

export type TSubmenuSection = 'accountSettings' | 'cashier';

type TMenuConfig = {
    LeftComponent: IconTypes;
    RightComponent?: ReactNode;
    as: 'a' | 'button';
    href?: string;
    label: string;
    onClick?: () => void;
    submenu?: TSubmenuSection;
}[];

type TSubmenu = {
    items: {
        href?: string;
        icon: IconTypes;
        label: string;
        subItems?: {
            href: string;
            text: string;
        }[];
    }[];
    section: string;
    title: string;
};

type TSubmenuConfig = {
    accountSettings: TSubmenu;
    cashier: TSubmenu;
};

export const MobileMenuConfig = () => {
    const { localize } = useTranslations();

    const menuConfig: TMenuConfig[] = [
        [
            {
                as: 'a',
                href: URLConstants.derivComProduction,
                label: localize('Deriv.com'),
                LeftComponent: BrandDerivLogoCoralIcon,
            },
            {
                as: 'a',
                href: URLConstants.derivAppProduction,
                label: localize("Trader's Hub"),
                LeftComponent: LegacyHomeOldIcon,
            },
            {
                as: 'a',
                href: `${URLConstants.derivAppProduction}/dtrader`,
                label: localize('Trade'),
                LeftComponent: LegacyChartsIcon,
            },
            {
                as: 'button',
                label: localize('Account Settings'),
                LeftComponent: LegacyProfileSmIcon,
                RightComponent: <LegacyChevronRight1pxIcon iconSize='xs' />,
                submenu: 'accountSettings',
            },
            {
                as: 'button',
                label: localize('Cashier'),
                LeftComponent: LegacyCashierIcon,
                RightComponent: <LegacyChevronRight1pxIcon iconSize='xs' />,
                submenu: 'cashier',
            },
            {
                as: 'button',
                label: localize('Dark theme'),
                LeftComponent: LegacyTheme1pxIcon,
                RightComponent: <ToggleSwitch />,
            },
        ],
        [
            {
                as: 'a',
                href: HELP_CENTRE,
                label: localize('Help center'),
                LeftComponent: LegacyHelpCentreIcon,
            },
            {
                as: 'a',
                href: ACCOUNT_LIMITS,
                label: localize('Account limits'),
                LeftComponent: LegacyAccountLimitsIcon,
            },
            {
                as: 'a',
                href: RESPONSIBLE,
                label: localize('Responsible trading'),
                LeftComponent: LegacyResponsibleTradingIcon,
            },
        ],
        [
            {
                as: 'a',
                href: URLConstants.whatsApp,
                label: localize('WhatsApp'),
                LeftComponent: LegacyWhatsappIcon,
            },
            {
                as: 'button',
                label: localize('Live chat'),
                LeftComponent: LegacyLiveChatOutlineIcon,
            },
        ],
        [
            {
                as: 'button',
                label: localize('Log out'),
                LeftComponent: LegacyLogout1pxIcon,
            },
        ],
    ];

    const submenuConfig: TSubmenuConfig = {
        accountSettings: {
            items: [
                {
                    icon: LegacyProfileSmIcon,
                    label: localize('Profile'),
                    subItems: [
                        {
                            href: `${URLConstants.derivAppProduction}/account/personal-details`,
                            text: localize('Personal details'),
                        },
                    ],
                },
                {
                    icon: LegacyAssessmentIcon,
                    label: localize('Assessments'),
                    subItems: [
                        // { text: localize('Trading assessment') },
                        {
                            href: `${URLConstants.derivAppProduction}/account/financial-assessment`,
                            text: localize('Financial assessment'),
                        },
                    ],
                },
                {
                    icon: LegacyVerificationIcon,
                    label: localize('Verification'),
                    subItems: [
                        {
                            href: `${URLConstants.derivAppProduction}/account/proof-of-identity`,
                            text: localize('Proof of identity'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/proof-of-address`,
                            text: localize('Proof of address'),
                        },
                        // { text: localize('Proof of ownership') },
                        // { text: localize('Proof of income') },
                    ],
                },
                {
                    icon: LegacySecurityIcon,
                    label: localize('Security and safety'),
                    subItems: [
                        {
                            href: `${URLConstants.derivAppProduction}/account/passwords`,
                            text: localize('Email and passwords'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/passkeys`,
                            text: localize('Passkeys'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/self-exclusion`,
                            text: localize('Self exclusion'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/account-limits`,
                            text: localize('Account limits'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/login-history`,
                            text: localize('Login history'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/api-token`,
                            text: localize('API token'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/connected-apps`,
                            text: localize('Connected apps'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/two-factor-authentication`,
                            text: localize('Two-factor authentication'),
                        },
                        {
                            href: `${URLConstants.derivAppProduction}/account/closing-account`,
                            text: localize('Close your account'),
                        },
                    ],
                },
            ],
            section: 'account',
            title: localize('Account Settings'),
        },
        cashier: {
            items: [
                {
                    href: `${URLConstants.derivAppProduction}/cashier/deposit`,
                    icon: LegacyDepositIcon,
                    label: localize('Deposit'),
                },
                {
                    href: `${URLConstants.derivAppProduction}/cashier/withdrawal`,
                    icon: LegacyWithdrawalIcon,
                    label: localize('Withdrawal'),
                },
                {
                    href: `${URLConstants.derivAppProduction}/cashier/account-transfer`,
                    icon: LegacyTransferIcon,
                    label: localize('Transfer'),
                },
                {
                    href: `${URLConstants.derivAppProduction}/cashier/p2p/buy-sell`,
                    icon: LegacyDerivP2pIcon,
                    label: localize('Deriv P2P'),
                },
            ],
            section: 'cashier',
            title: localize('Cashier'),
        },
    };

    return { menuConfig, submenuConfig };
};
