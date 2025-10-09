import { DERIV_COM, getDomainUrl } from '@/constants';
import { LegacyDerivIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';

const Deriv = () => {
    return (
        <Tooltip
            as='a'
            className='app-footer__icon'
            href={DERIV_COM}
            target='_blank'
            tooltipContent={<Localize i18n_default_text='Go to {{url}}' values={{ url: getDomainUrl() }} />}
        >
            <LegacyDerivIcon iconSize='xs' />
        </Tooltip>
    );
};

export default Deriv;
