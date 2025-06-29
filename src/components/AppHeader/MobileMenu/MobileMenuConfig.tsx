import { ComponentProps, ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { HELP_CENTRE, RESPONSIBLE } from '@/constants';
import { useOAuth, useShouldRedirectToLowCodeHub } from '@/hooks/custom-hooks';
import { useIsLoadingOidcStore } from '@/stores';
import { Chat } from '@/utils';
import {
    BrandDerivLogoCoralIcon,
    IconTypes,
    LegacyAccountLimitsIcon,
    LegacyCashierIcon,
    LegacyChartsIcon,
    LegacyHelpCentreIcon,
    LegacyHomeOldIcon,
    LegacyLiveChatOutlineIcon,
    LegacyLogout1pxIcon,
    LegacyProfileSmIcon,
    LegacyReportsIcon,
    LegacyResponsibleTradingIcon,
    LegacyWhatsappIcon,
} from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { URLConstants } from '@deriv-com/utils';

export type TSubmenuSection = 'accountSettings' | 'cashier';

type TMenuConfig = {
    LeftComponent: IconTypes;
    RightComponent?: ReactNode;
    as: 'a' | 'button';
    href?: string;
    label: string;
    name?: string;
    onClick?: () => void;
    removeBorderBottom?: boolean;
    submenu?: TSubmenuSection;
    target?: ComponentProps<'a'>['target'];
}[];

export const MobileMenuConfig = () => {
    const { localize } = useTranslations();
    const { oAuthLogout } = useOAuth();

    const { setIsCheckingOidcTokens } = useIsLoadingOidcStore(
        useShallow(state => ({
            setIsCheckingOidcTokens: state.setIsCheckingOidcTokens,
        }))
    );

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
                href: useShouldRedirectToLowCodeHub(),
                label: localize("Trader's Hub"),
                LeftComponent: LegacyHomeOldIcon,
            },
            {
                as: 'a',
                href: `${useShouldRedirectToLowCodeHub()}/dtrader`,
                label: localize('Trade'),
                LeftComponent: LegacyChartsIcon,
            },
            {
                as: 'a',
                href: `${useShouldRedirectToLowCodeHub()}/reports`,
                label: localize('Reports'),
                LeftComponent: LegacyReportsIcon,
                name: 'Reports',
            },
            {
                as: 'a',
                href: useShouldRedirectToLowCodeHub('personal-details'),
                label: localize('Account Settings'),
                LeftComponent: LegacyProfileSmIcon,
            },
            {
                as: 'a',
                href: `${useShouldRedirectToLowCodeHub()}/cashier/deposit`,
                label: localize('Cashier'),
                LeftComponent: LegacyCashierIcon,
                name: 'Cashier',
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
                href: useShouldRedirectToLowCodeHub('account-limits'),
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
            {
                as: 'button',
                label: localize('Live chat'),
                LeftComponent: LegacyLiveChatOutlineIcon,
                onClick: () => {
                    Chat.open();
                },
            },
        ],
        [
            {
                as: 'button',
                label: localize('Log out'),
                LeftComponent: LegacyLogout1pxIcon,
                onClick: () => {
                    setIsCheckingOidcTokens(true);
                    Chat.clear();
                    oAuthLogout();
                },
                removeBorderBottom: true,
            },
        ],
    ];

    return menuConfig;
};
