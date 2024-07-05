import { MouseEventHandler } from 'react';
import { useQueryString } from '@/hooks/custom-hooks';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import './AdFormController.scss';

type TAdFormControllerProps = {
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: () => void;
    isNextButtonDisabled: boolean;
    onCancel?: () => void;
};

const AdFormController = ({
    getCurrentStep,
    getTotalSteps,
    goToNextStep,
    goToPreviousStep,
    isNextButtonDisabled,
    onCancel,
}: TAdFormControllerProps) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    const { queryString } = useQueryString();
    const { advertId = '' } = queryString;
    const isEdit = !!advertId;
    return (
        <div className='ad-form-controller'>
            <Button
                className='border-2'
                color='black'
                onClick={() => (onCancel ? onCancel() : goToPreviousStep())}
                size='lg'
                textSize={textSize}
                type='button'
                variant='outlined'
            >
                {onCancel ? <Localize i18n_default_text='Cancel' /> : <Localize i18n_default_text='Previous' />}
            </Button>
            {getCurrentStep() < getTotalSteps() ? (
                <Button
                    disabled={isNextButtonDisabled}
                    onClick={goToNextStep}
                    size='lg'
                    textSize={textSize}
                    type='button'
                    variant='contained'
                >
                    <Localize i18n_default_text='Next' />
                </Button>
            ) : (
                <Button size='lg' textSize={textSize}>
                    {isEdit ? <Localize i18n_default_text='Save changes' /> : <Localize i18n_default_text='Post ad' />}
                </Button>
            )}
        </div>
    );
};

export default AdFormController;
