import { LightDivider } from '@/components/LightDivider';
import { useGetBusinessHours } from '@/hooks/custom-hooks';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './BusinessHoursModal.scss';

const BusinessHoursModal = () => {
    const { businessHours } = useGetBusinessHours();
    const today = new Date().getDay();

    return (
        <Modal ariaHideApp={false} className='business-hours-modal' isOpen>
            <Modal.Header hideBorder>
                <Text weight='bold'>
                    <Localize i18n_default_text='Business hours' />
                </Text>
            </Modal.Header>
            <Modal.Body className='px-[2.4rem] py-6'>
                <Text size='sm'>
                    <Localize i18n_default_text='Choose when you’re available to accept orders. Your ads will only be visible during these times.' />
                </Text>
                <LightDivider className='my-[1.6rem]' />
                <div className='flex flex-col gap-y-[0.8rem] pb-[1.6rem]'>
                    {businessHours.map((day, index) => {
                        const textWeight = index === today ? 'bold' : 'normal';

                        return (
                            <div className='flex gap-[1.6rem]' key={day.value}>
                                <Text className='w-40' size='xs' weight={textWeight}>
                                    {day.day}
                                </Text>
                                <Text size='xs' weight={textWeight}>
                                    {day.time}
                                </Text>
                            </div>
                        );
                    })}
                </div>
                <div className='flex flex-col'>
                    <Text size='xs'>
                        <Localize i18n_default_text='* You can only place orders on other ads during your set business hours.' />
                    </Text>
                    <Text size='xs'>
                        <Localize i18n_default_text='* Some ads may have a delay before becoming visible to potential buyers.' />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button className='border-[1px] py-8' color='black' variant='outlined'>
                    <Localize i18n_default_text='Edit business hours' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BusinessHoursModal;
