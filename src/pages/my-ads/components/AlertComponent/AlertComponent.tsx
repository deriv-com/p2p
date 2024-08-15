import { LegacyWarningIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';
import './AlertComponent.scss';

type TAlertComponentProps = {
    onClick: () => void;
};

const AlertComponent = ({ onClick }: TAlertComponentProps) => {
    const { localize } = useTranslations();
    return (
        <div className='alert-component'>
            <Tooltip as='button' onClick={onClick} tooltipContent={localize('Ad not listed')} tooltipPosition='top'>
                <LegacyWarningIcon data-testid='dt_alert_icon' iconSize='xs' />
            </Tooltip>
        </div>
    );
};

export default AlertComponent;
