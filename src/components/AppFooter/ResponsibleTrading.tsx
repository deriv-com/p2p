import { LegacyResponsibleTradingIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '@deriv-com/ui';

const ResponsibleTrading = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='a'
            className='app-footer__icon'
            href='https://deriv.com/responsible/'
            target='_blank'
            tooltipContent={localize('Responsible trading')}
        >
            <LegacyResponsibleTradingIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default ResponsibleTrading;
