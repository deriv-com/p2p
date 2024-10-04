import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';

type TBusinessHoursModalFooter = {
    isSaveDisabled: boolean;
    onCancel: () => void;
    onSave: () => void;
    setShowEdit: (showEdit: boolean) => void;
    showEdit: boolean;
};

const BusinessHoursModalFooter = ({
    isSaveDisabled,
    onCancel,
    onSave,
    setShowEdit,
    showEdit,
}: TBusinessHoursModalFooter) => {
    const { isDesktop, isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    if (showEdit) {
        return (
            <div className='flex gap-[0.8rem]'>
                <Button
                    className='border-2'
                    color='black'
                    isFullWidth={!isDesktop}
                    onClick={onCancel}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button
                    disabled={isSaveDisabled}
                    isFullWidth={!isDesktop}
                    onClick={onSave}
                    size='lg'
                    textSize={textSize}
                >
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
            onClick={() => setShowEdit(true)}
            textSize={textSize}
            variant='outlined'
        >
            <Localize i18n_default_text='Edit business hours' />
        </Button>
    );
};

export default BusinessHoursModalFooter;
