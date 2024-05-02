import { LegacyWarningIcon } from '@deriv/quill-icons';
import { Button, Tooltip } from '@deriv-com/ui';
import './AlertComponent.scss';

type TAlertComponentProps = {
    onClick: () => void;
};

const AlertComponent = ({ onClick }: TAlertComponentProps) => (
    <div className='alert-component'>
        <Tooltip message='Ad not listed' position='bottom'>
            <Button className='p-0 hover:bg-none' color='white' onClick={onClick} variant='outlined'>
                <LegacyWarningIcon data-testid='dt_alert_icon' iconSize='xs' />
            </Button>
        </Tooltip>
    </div>
);

export default AlertComponent;
