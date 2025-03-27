import { ComponentProps, ReactNode } from 'react';
import { ACCOUNT_LIMITS, HELP_CENTRE, RESPONSIBLE } from '@/constants';
import { useGrowthbookGetFeatureValue, useOAuth, useShouldRedirectToLowCodeHub } from '@/hooks/custom-hooks';
import useFreshChat from '@/hooks/custom-hooks/useFreshchat';
import useIntercom from '@/hooks/custom-hooks/useIntercom';
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

    const [isFreshChatEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshworks_live_chat_p2p',
    });
    const [isIntercomEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_intercom_p2p',
    });

    const token = localStorage.getItem('authToken') || null;
    useFreshChat(token, isFreshChatEnabled as boolean);
    useIntercom(token, isIntercomEnabled as boolean);

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
                href: `${URLConstants.derivAppProduction}/dtrader`,
                label: localize('Trade'),
                LeftComponent: LegacyChartsIcon,
            },
            {
                as: 'a',
                href: `${URLConstants.derivAppProduction}/reports`,
                label: localize('Reports'),
                LeftComponent: LegacyReportsIcon,
            },
            {
                as: 'a',
                href: `${URLConstants.derivAppProduction}/account/personal-details`,
                label: localize('Account Settings'),
                LeftComponent: LegacyProfileSmIcon,
            },
            {
                as: 'a',
                href: `${URLConstants.derivAppProduction}/cashier/deposit`,
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
                    Chat.clear();
                    oAuthLogout();
                },
                removeBorderBottom: true,
            },
        ],
    ];

    return menuConfig;
};
