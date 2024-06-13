import { Controller, useForm } from 'react-hook-form';
import { VALID_SYMBOLS_PATTERN } from '@/constants';
import { useTranslations } from '@deriv-com/translations';
import { TextArea, useDevice } from '@deriv-com/ui';

type TMyProfileAdDetailsTextAreaProps = {
    control: ReturnType<typeof useForm>['control'];
};

const MyProfileAdDetailsTextArea = ({ control }: TMyProfileAdDetailsTextAreaProps) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

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
                        message: localize(
                            "Contact details can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;"
                        ),
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
                        message: localize(
                            "Instructions can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;"
                        ),
                        value: VALID_SYMBOLS_PATTERN,
                    },
                }}
            />
        </>
    );
};

export default MyProfileAdDetailsTextArea;
