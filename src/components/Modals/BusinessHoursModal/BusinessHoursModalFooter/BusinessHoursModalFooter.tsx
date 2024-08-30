import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';

type TBusinessHoursModalFooter = {
    isEdit: boolean;
};

const BusinessHoursModalFooter = ({ isEdit }: TBusinessHoursModalFooter) => {
    const { isDesktop, isMobile } = useDevice();
    if (isEdit) {
        return (
            <div>
                <Button className='border-[1px]' color='black' variant='outlined'>
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button className='border-[1px]' variant='outlined'>
                    <Localize i18n_default_text='Save' />
                </Button>
            </div>
        );
    }
    return (
        <Button
            className='lg:border-[1px] py-8'
            color='black'
            isFullWidth={!isDesktop}
            textSize={isMobile ? 'md' : 'sm'}
            variant='outlined'
        >
            <Localize i18n_default_text='Edit business hours' />
        </Button>
    );
};

export default BusinessHoursModalFooter;
