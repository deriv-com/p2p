import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Text } from '@deriv-com/ui';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';
import './Endpoint.scss';

const Endpoint = () => {
    const {
        control,
        formState: { isDirty, isValid },
        getValues,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            serverUrl: localStorage.getItem(LocalStorageConstants.configServerURL.toString()) || '',
            appId: LocalStorageUtils.getValue(LocalStorageConstants.configAppId) || '',
        },
        mode: 'onChange',
    });

    return (
        <div className='endpoint flex flex-col gap-8'>
            <Text weight='bold'>Change API endpoint</Text>
            <form className='flex flex-col' action=''>
                <Controller
                    control={control}
                    name='serverUrl'
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                        <Input
                            label='Server'
                            message={error?.message}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                    rules={{
                        required: 'This field is required',
                    }}
                />
                <Controller
                    control={control}
                    name='appId'
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                        <Input
                            label='OAuth App ID'
                            message={error?.message}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                    rules={{
                        required: 'This field is required',
                        pattern: {
                            message: 'Please enter a valid app ID',
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        },
                    }}
                />
                <Button
                    className='w-40'
                    disabled={!isDirty || !isValid}
                    onClick={handleSubmit(() => {
                        // Can't use LocalStorageUtils.setValue because it will place "" around the value
                        localStorage.setItem(LocalStorageConstants.configServerURL, getValues('serverUrl'));
                        localStorage.setItem(LocalStorageConstants.configAppId, getValues('appId'));
                        reset({
                            serverUrl: getValues('serverUrl'),
                            appId: getValues('appId'),
                        });
                    })}
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default Endpoint;
