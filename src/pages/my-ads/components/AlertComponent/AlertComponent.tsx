import { TooltipMenuIcon } from '@/components/TooltipMenuIcon';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import './AlertComponent.scss';

type TAlertComponentProps = {
    onClick: () => void;
};

const AlertComponent = ({ onClick }: TAlertComponentProps) => {
    const { localize } = useTranslations();
    return (
        <div className='alert-component'>
            <TooltipMenuIcon
                as='button'
                onClick={onClick}
                tooltipContent={localize('Ad not listed')}
                tooltipPosition='top'
            >
                <LegacyWarningIcon data-testid='dt_alert_icon' iconSize='xs' />
            </TooltipMenuIcon>
        </div>
    );
};

export default AlertComponent;
