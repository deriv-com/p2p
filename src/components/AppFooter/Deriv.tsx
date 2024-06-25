import { DERIV_COM } from '@/constants';
import { LegacyDerivIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { TooltipMenuIcon } from '../TooltipMenuIcon';

const Deriv = () => {
    const { localize } = useTranslations();

    return (
        <TooltipMenuIcon
            as='a'
            className='app-footer__icon'
            href={DERIV_COM}
            target='_blank'
            tooltipContent={localize('Go to deriv.com')}
        >
            <LegacyDerivIcon iconSize='xs' />
        </TooltipMenuIcon>
    );
};

export default Deriv;
