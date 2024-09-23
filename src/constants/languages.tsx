import { ComponentType, SVGProps } from 'react';
import {
    FlagArabLeagueIcon,
    FlagBangladeshIcon,
    FlagCambodiaIcon,
    FlagChinaSimplifiedIcon,
    FlagChinaTraditionalIcon,
    FlagFranceIcon,
    FlagGermanyIcon,
    FlagIndonesiaIcon,
    FlagItalyIcon,
    FlagMongoliaIcon,
    FlagPolandIcon,
    FlagPortugalIcon,
    FlagRussiaIcon,
    FlagSouthKoreaIcon,
    FlagSpainIcon,
    FlagSriLankaIcon,
    FlagTanzaniaIcon,
    FlagThailandIcon,
    FlagTurkeyIcon,
    FlagUnitedKingdomIcon,
    FlagVietnamIcon,
} from '@deriv/quill-icons';
import { getAllowedLanguages } from '@deriv-com/translations';

type TFlagComponent = {
    [key: string]: ComponentType<SVGProps<SVGSVGElement>>;
};

const flagComponents: TFlagComponent = {
    AR: FlagArabLeagueIcon,
    BN: FlagBangladeshIcon,
    DE: FlagGermanyIcon,
    EN: FlagUnitedKingdomIcon,
    ES: FlagSpainIcon,
    FR: FlagFranceIcon,
    ID: FlagIndonesiaIcon,
    IT: FlagItalyIcon,
    KM: FlagCambodiaIcon,
    KO: FlagSouthKoreaIcon,
    MN: FlagMongoliaIcon,
    PL: FlagPolandIcon,
    PT: FlagPortugalIcon,
    RU: FlagRussiaIcon,
    SI: FlagSriLankaIcon,
    SW: FlagTanzaniaIcon,
    TH: FlagThailandIcon,
    TR: FlagTurkeyIcon,
    VI: FlagVietnamIcon,
    ZH_CN: FlagChinaSimplifiedIcon,
    ZH_TW: FlagChinaTraditionalIcon,
};

const createFlagData = () => {
    return Object.entries(getAllowedLanguages(['ID', 'MN'])).map(([code, displayName]) => {
        const IconComponent = flagComponents[code];
        return {
            code,
            displayName,
            icon: <IconComponent height={24} width={36} />,
            placeholderIcon: <IconComponent height={12} width={18} />,
            placeholderIconInMobile: <IconComponent height={14.67} width={22} />,
        };
    });
};

export const LANGUAGES = createFlagData();
