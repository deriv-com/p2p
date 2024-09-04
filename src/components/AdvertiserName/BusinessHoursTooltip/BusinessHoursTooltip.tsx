import { BusinessHoursModal } from '@/components/Modals';
import { TooltipMenuIcon } from '@/components/TooltipMenuIcon';
import { useGetBusinessHours, useModalManager } from '@/hooks/custom-hooks';
import { LegacyTimeIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import './BusinessHoursTooltip.scss';

const BusinessHoursTooltip = () => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const { isScheduleAvailable } = useGetBusinessHours();
    const { hideModal, isModalOpenFor, showModal } = useModalManager();

    return (
        <>
            <TooltipMenuIcon as='button' className='business-hours-tooltip' tooltipContent={localize('Business hours')}>
                <LegacyTimeIcon iconSize='xs' />
                <Text
                    as='button'
                    className='underline'
                    onClick={() => showModal('BusinessHoursModal')}
                    size={isMobile ? 'xs' : 'sm'}
                    weight='bold'
                >
                    {isScheduleAvailable ? (
                        <Localize i18n_default_text='Open' />
                    ) : (
                        <Localize i18n_default_text='Closed' />
                    )}
                </Text>
            </TooltipMenuIcon>
            {isModalOpenFor('BusinessHoursModal') && <BusinessHoursModal hideModal={hideModal} isModalOpen />}
        </>
    );
};

export default BusinessHoursTooltip;
