import { RESPONSIBLE } from '@/constants';
import { LegacyResponsibleTradingIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

const ResponsibleTrading = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='a'
            className='app-footer__icon'
            href={RESPONSIBLE}
            target='_blank'
            tooltipContent={localize('Responsible trading')}
        >
            <LegacyResponsibleTradingIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default ResponsibleTrading;
