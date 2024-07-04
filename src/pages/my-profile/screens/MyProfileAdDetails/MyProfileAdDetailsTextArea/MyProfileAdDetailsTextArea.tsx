import { Controller, useForm } from 'react-hook-form';
import { VALID_SYMBOLS_PATTERN } from '@/constants';
import { getTextFieldError } from '@/utils';
import { useTranslations } from '@deriv-com/translations';
import { TextArea, useDevice } from '@deriv-com/ui';

type TMyProfileAdDetailsTextAreaProps = {
    control: ReturnType<typeof useForm>['control'];
};

const MyProfileAdDetailsTextArea = ({ control }: TMyProfileAdDetailsTextAreaProps) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';

    return (
        <>
            <Controller
                control={control}
                name='ad_details_contact'
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <TextArea
                        data-testid='dt_profile_ad_details_contact'
                        hint={error?.message}
                        isInvalid={!!error?.message}
                        label={localize('Contact details')}
                        maxLength={300}
                        onBlur={onBlur}
                        onChange={onChange}
                        shouldShowCounter
                        textSize={textSize}
                        value={value}
                    />
                )}
                rules={{
                    pattern: {
                        message: getTextFieldError('Contact details'),
                        value: VALID_SYMBOLS_PATTERN,
                    },
                }}
            />
            <Controller
                control={control}
                name='ad_details_description'
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                    <TextArea
                        data-testid='dt_profile_ad_details_description'
                        hint={error?.message || localize('This information will be visible to everyone.')}
                        isInvalid={!!error?.message}
                        label={localize('Instructions')}
                        maxLength={300}
                        onBlur={onBlur}
                        onChange={onChange}
                        shouldShowCounter
                        textSize={textSize}
                        value={value}
                    />
                )}
                rules={{
                    pattern: {
                        message: getTextFieldError('Instructions'),
                        value: VALID_SYMBOLS_PATTERN,
                    },
                }}
            />
        </>
    );
};

export default MyProfileAdDetailsTextArea;
