import { LightDivider } from '@/components/LightDivider';
import { useGetBusinessHours } from '@/hooks';
import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

const BusinessHoursModalMain = () => {
    const { businessHours } = useGetBusinessHours();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'sm' : 'xs';
    const today = new Date().getDay() - 1;

    return (
        <div className='lg:p-0 p-[1.6rem] h-full flex flex-col justify-between'>
            <div>
                <Text size='sm'>
                    <Localize i18n_default_text='Choose when you’re available to accept orders. Your ads will only be visible during these times.' />
                </Text>
                <LightDivider className='my-[1.6rem]' />
                <div className='flex flex-col gap-y-[0.8rem] pb-[1.6rem]'>
                    {businessHours.map((day, index) => {
                        const textWeight = index === today ? 'bold' : 'normal';

                        return (
                            <div className='flex gap-[1.6rem]' key={day.value}>
                                <Text className='w-40' size='sm' weight={textWeight}>
                                    {day.day}
                                </Text>
                                <Text size='sm' weight={textWeight}>
                                    {day.time}
                                </Text>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Text size={textSize}>
                <Localize i18n_default_text='* You can only place orders on other ads during your set business hours.' />
            </Text>
        </div>
    );
};

export default BusinessHoursModalMain;
