import { useState } from 'react';
import { TCountryListItem, TCurrency, TOrderExpiryOptions, TStep } from 'types';
import { FormProgress, Wizard } from '@/components';
import { LabelPairedXmarkLgBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { AdConditionsSection } from '../AdConditionsSection';
import { AdPaymentDetailsSection } from '../AdPaymentDetailsSection';
import { AdProgressBar } from '../AdProgressBar';
import { AdTypeSection } from '../AdTypeSection';
import './AdWizard.scss';

type TAdWizardNav = {
    countryList: TCountryListItem;
    currency: TCurrency;
    localCurrency?: TCurrency;
    onCancel: () => void;
    orderExpiryOptions: TOrderExpiryOptions;
    rateType: string;
    steps: TStep[];
};

const AdWizard = ({ countryList, onCancel, orderExpiryOptions, steps, ...rest }: TAdWizardNav) => {
    const { isDesktop } = useDevice();
    const [currentStep, setCurrentStep] = useState(0);
    const wizardProps = {
        getCurrentStep: () => currentStep + 1,
        getTotalSteps: () => steps.length,
        goToNextStep: () => setCurrentStep(currentStep + 1),
        goToPreviousStep: () => setCurrentStep(currentStep - 1),
    };

    return (
        <Wizard
            className='ad-wizard'
            initialStep={0}
            nav={
                <div>
                    {isDesktop ? (
                        <FormProgress currentStep={currentStep} steps={steps} />
                    ) : (
                        <div className='flex items-center justify-around'>
                            <AdProgressBar currentStep={currentStep} steps={steps} />
                            <div>
                                <Text weight='bold'>{steps[currentStep].header.title}</Text>
                                {steps[currentStep + 1] ? (
                                    <Text as='div' color='less-prominent'>
                                        <Localize
                                            i18n_default_text='Next: {{title}}'
                                            values={{ title: steps[currentStep + 1].header.title }}
                                        />
                                    </Text>
                                ) : (
                                    <Text as='div' color='less-prominent'>
                                        <Localize i18n_default_text='Last step' />
                                    </Text>
                                )}
                            </div>
                            <Button
                                color='white'
                                icon={<LabelPairedXmarkLgBoldIcon />}
                                onClick={onCancel}
                                type='button'
                                variant='contained'
                            />
                        </div>
                    )}
                </div>
            }
            onStepChange={step => setCurrentStep(step.activeStep - 1)}
        >
            <AdTypeSection onCancel={onCancel} {...wizardProps} {...rest} />
            <AdPaymentDetailsSection {...wizardProps} {...rest} orderExpiryOptions={orderExpiryOptions} />
            <AdConditionsSection {...wizardProps} countryList={countryList} {...rest} />
        </Wizard>
    );
};

export default AdWizard;
