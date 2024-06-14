import { ComponentProps, ReactNode } from 'react';
import { ACCOUNT_LIMITS, HELP_CENTRE, RESPONSIBLE } from '@/constants';
import {
    BrandDerivLogoCoralIcon,
    IconTypes,
    LegacyAccountLimitsIcon,
    // LegacyAssessmentIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    // LegacyChevronRight1pxIcon,
    // LegacyDepositIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
    // LegacyLiveChatOutlineIcon,
    LegacyLogout1pxIcon,
    LegacyProfileSmIcon,
    LegacyResponsibleTradingIcon,
    // LegacySecurityIcon,
    // LegacyTheme1pxIcon,
    // LegacyTransferIcon,
    // LegacyVerificationIcon,
    LegacyWhatsappIcon,
    // LegacyWithdrawalIcon,
} from '@deriv/quill-icons';
import { useAuthData } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
// import { ToggleSwitch } from '@deriv-com/ui';
import { URLConstants } from '@deriv-com/utils';

export type TSubmenuSection = 'accountSettings' | 'cashier';

type TMenuConfig = {
    LeftComponent: IconTypes;
    RightComponent?: ReactNode;
    as: 'a' | 'button';
    href?: string;
    label: string;
    onClick?: () => void;
    removeBorderBottom?: boolean;
    submenu?: TSubmenuSection;
    target?: ComponentProps<'a'>['target'];
}[];

// type TSubmenu = {
//     items: {
//         Icon: IconTypes;
//         href?: string;
//         label: string;
//         subItems?: {
//             href?: string;
//             onClick?: ComponentProps<'button'>['onClick'];
//             text: string;
//         }[];
//     }[];
//     section: string;
//     title: string;
// };

// type TSubmenuConfig = {
//     accountSettings: TSubmenu;
//     cashier: TSubmenu;
// };

export const MobileMenuConfig = () => {
    const { localize } = useTranslations();
    const { logout } = useAuthData();

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
                // as: 'button',
                as: 'a',
                href: `${URLConstants.derivAppProduction}/account/personal-details`,
                label: localize('Account Settings'),
                LeftComponent: LegacyProfileSmIcon,
                // RightComponent: <LegacyChevronRight1pxIcon iconSize='xs' />,
                // submenu: 'accountSettings',
            },
            {
                // as: 'button',
                as: 'a',
                href: `${URLConstants.derivAppProduction}/cashier/deposit`,
                label: localize('Cashier'),
                LeftComponent: LegacyCashierIcon,
                // RightComponent: <LegacyChevronRight1pxIcon iconSize='xs' />,
                // submenu: 'cashier',
            },
            // TODO add theme logic
            // {
            //     as: 'button',
            //     label: localize('Dark theme'),
            //     LeftComponent: LegacyTheme1pxIcon,
            //     RightComponent: <ToggleSwitch />,
            // },
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
            {
                as: 'a',
                href: URLConstants.whatsApp,
                label: localize('WhatsApp'),
                LeftComponent: LegacyWhatsappIcon,
                target: '_blank',
            },
            // TODO add livechat logic
            // {
            //     as: 'button',
            //     label: localize('Live chat'),
            //     LeftComponent: LegacyLiveChatOutlineIcon,
            // },
        ],
        [
            {
                as: 'button',
                label: localize('Log out'),
                LeftComponent: LegacyLogout1pxIcon,
                onClick: logout,
                removeBorderBottom: true,
            },
        ],
    ];

    // const submenuConfig: TSubmenuConfig = {
    // TODO add disable/enable conditions to the accountsettings menu
    //     accountSettings: {
    //         items: [
    //             {
    //                 Icon: LegacyProfileSmIcon,
    //                 label: localize('Profile'),
    //                 subItems: [
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/personal-details`,
    //                         text: localize('Personal details'),
    //                     },
    //                     {
    // TODO add OpenLanguageSetting onClick
    //                         text: localize('Languages'),
    //                     },
    //                 ],
    //             },
    //             {
    //                 Icon: LegacyAssessmentIcon,
    //                 label: localize('Assessments'),
    //                 subItems: [
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/trading-assessment`,
    //                         text: localize('Trading assessment'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/financial-assessment`,
    //                         text: localize('Financial assessment'),
    //                     },
    //                 ],
    //             },
    //             {
    //                 Icon: LegacyVerificationIcon,
    //                 label: localize('Verification'),
    //                 subItems: [
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/proof-of-identity`,
    //                         text: localize('Proof of identity'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/proof-of-address`,
    //                         text: localize('Proof of address'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/proof-of-ownership`,
    //                         text: localize('Proof of ownership'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/proof-of-income`,
    //                         text: localize('Proof of income'),
    //                     },
    //                 ],
    //             },
    //             {
    //                 Icon: LegacySecurityIcon,
    //                 label: localize('Security and safety'),
    //                 subItems: [
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/passwords`,
    //                         text: localize('Email and passwords'),
    //                     },
    //                     {
    // TODO add new badge for passkey
    //                         href: `${URLConstants.derivAppProduction}/account/passkeys`,
    //                         text: localize('Passkeys'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/self-exclusion`,
    //                         text: localize('Self exclusion'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/account-limits`,
    //                         text: localize('Account limits'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/login-history`,
    //                         text: localize('Login history'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/api-token`,
    //                         text: localize('API token'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/connected-apps`,
    //                         text: localize('Connected apps'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/two-factor-authentication`,
    //                         text: localize('Two-factor authentication'),
    //                     },
    //                     {
    //                         href: `${URLConstants.derivAppProduction}/account/closing-account`,
    //                         text: localize('Close your account'),
    //                     },
    //                 ],
    //             },
    //         ],
    //         section: 'account',
    //         title: localize('Account Settings'),
    //     },
    //     cashier: {
    //         items: [
    //             {
    //                 href: `${URLConstants.derivAppProduction}/cashier/deposit`,
    //                 Icon: LegacyDepositIcon,
    //                 label: localize('Deposit'),
    //             },
    //             {
    //                 href: `${URLConstants.derivAppProduction}/cashier/withdrawal`,
    //                 Icon: LegacyWithdrawalIcon,
    //                 label: localize('Withdrawal'),
    //             },
    //             {
    //                 href: `${URLConstants.derivAppProduction}/cashier/account-transfer`,
    //                 Icon: LegacyTransferIcon,
    //                 label: localize('Transfer'),
    //             },
    //         ],
    //         section: 'cashier',
    //         title: localize('Cashier'),
    //     },
    // };

    // return { menuConfig, submenuConfig };
    return { menuConfig };
};
