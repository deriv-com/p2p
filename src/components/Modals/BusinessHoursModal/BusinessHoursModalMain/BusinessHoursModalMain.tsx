import { LightDivider } from '@/components/LightDivider';
import { useGetBusinessHours } from '@/hooks';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

const BusinessHoursModalMain = () => {
    const { businessHours } = useGetBusinessHours();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'sm' : 'xs';
    const today = new Date().getDay();

    return (
        <div className='lg:p-0 p-[1.6rem] h-full relative'>
            <Text size='sm'>
                <Localize i18n_default_text='Choose when you’re available to accept orders. Your ads will only be visible during these times.' />
            </Text>
            <LightDivider className='my-[1.6rem]' />
            <div className='flex flex-col gap-y-[0.8rem] pb-[1.6rem]'>
                {businessHours.map((day, index) => {
                    const textWeight = index === today ? 'bold' : 'normal';

                    return (
                        <div className='flex gap-[1.6rem]' key={day.value}>
                            <Text className='w-40' size={textSize} weight={textWeight}>
                                {day.day}
                            </Text>
                            <Text size={textSize} weight={textWeight}>
                                {day.time}
                            </Text>
                        </div>
                    );
                })}
            </div>
            <div className='flex flex-col lg:relative absolute bottom-0 left-0 lg:p-0 p-[1.6rem]'>
                <Text size={textSize}>
                    <Localize i18n_default_text='* You can only place orders on other ads during your set business hours.' />
                </Text>
                <Text size={textSize}>
                    <Localize i18n_default_text='* Some ads may have a delay before becoming visible to potential buyers.' />
                </Text>
            </div>
        </div>
    );
};

export default BusinessHoursModalMain;
