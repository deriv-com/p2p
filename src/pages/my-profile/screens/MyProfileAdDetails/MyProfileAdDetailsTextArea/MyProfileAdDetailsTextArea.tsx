import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from '@deriv-com/translations';
import { TextArea, useDevice } from '@deriv-com/ui';

type TMyProfileAdDetailsTextAreaProps = {
    control: ReturnType<typeof useForm>['control'];
};

const MyProfileAdDetailsTextArea = ({ control }: TMyProfileAdDetailsTextAreaProps) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    const pattern = {
        message: localize(
            "Contact details can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;"
        ),
        value: /^[a-zA-Z0-9.@_\-+.,'#@():;\s]*$/,
    };

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
                rules={{ pattern }}
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
                rules={{ pattern }}
            />
        </>
    );
};

export default MyProfileAdDetailsTextArea;
