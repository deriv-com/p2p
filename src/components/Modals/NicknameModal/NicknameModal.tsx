import { useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { BUY_SELL_URL } from '@/constants';
import { api } from '@/hooks';
import { useAdvertiserInfoState } from '@/providers/AdvertiserInfoStateProvider';
import { getCurrentRoute } from '@/utils';
import { DerivLightIcCashierUserIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Input, Modal, Text, useDevice } from '@deriv-com/ui';
import './NicknameModal.scss';

type TNicknameModalProps = {
    isModalOpen: boolean | undefined;
    onRequestClose: () => void;
};

const NicknameModal = ({ isModalOpen, onRequestClose }: TNicknameModalProps) => {
    const { localize } = useTranslations();
    const {
        control,
        formState: { isDirty, isValid },
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            nickname: '',
        },
        mode: 'onChange',
    });

    const history = useHistory();
    const { error: createError, isError, isSuccess, mutate, reset } = api.advertiser.useCreate();
    const { setHasCreatedAdvertiser } = useAdvertiserInfoState();
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    const debouncedReset = debounce(reset, 3000);
    const currentRoute = getCurrentRoute();

    const onSubmit = () => {
        mutate({ name: getValues('nickname') });
    };

    useEffect(() => {
        if (isSuccess) {
            onRequestClose();
            setHasCreatedAdvertiser(true);
        } else if (isError) {
            debouncedReset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isSuccess, setHasCreatedAdvertiser]);

    return (
        <Modal ariaHideApp={false} className='nickname-modal' isOpen={!!isModalOpen}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className='nickname-modal__body'>
                    <DerivLightIcCashierUserIcon height='12.8rem' width='12.8rem' />
                    <Text className='nickname-modal__body-title' weight='bold'>
                        <Localize i18n_default_text='What’s your nickname?' />
                    </Text>
                    <Text align='center' className='mt-4 mb-6' size={textSize}>
                        <Localize i18n_default_text='Others will see this on your profile, ads and charts.' />
                    </Text>
                    <Controller
                        control={control}
                        name='nickname'
                        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                            <Input
                                data-testid='dt_nickname_modal_input'
                                error={!!error?.message || isError}
                                label={localize('Your nickname')}
                                message={createError?.message || error?.message}
                                onBlur={onBlur}
                                onChange={onChange}
                                value={value}
                            />
                        )}
                        rules={{
                            // TODO: Add these to a config file with other form validation messages
                            maxLength: {
                                message: localize('Nickname is too long'),
                                value: 24,
                            },
                            minLength: {
                                message: localize('Nickname is too short'),
                                value: 2,
                            },
                            pattern: {
                                message: localize('Can only contain letters, numbers, and special characters .-_@.'),
                                value: /^[a-zA-Z0-9.@_-]*$/,
                            },
                            required: localize('Nickname is required'),
                            validate: {
                                noRepeatedCharsMoreThanFourTimes: value =>
                                    !/(.)\1{4,}/.test(value) ||
                                    localize('Cannot repeat a character more than 4 times.'),
                                noSpecialCharsAtStartEndOrRepeated: value =>
                                    !/^[.@_-].*|[.@_-]{2,}|.*[.@_-]$/.test(value) ||
                                    localize('Cannot start, end with, or repeat special characters.'),
                            },
                        }}
                    />
                    <Text className='my-10' size={textSize}>
                        <Localize
                            i18n_default_text='
                        Your nickname cannot be changed later.'
                        />
                    </Text>
                </Modal.Body>
                <Modal.Footer className='p-0 min-h-0' hideBorder>
                    <Button
                        className='border-2 mr-[0.8rem]'
                        color='black'
                        onClick={() => {
                            if (currentRoute !== 'my-ads' && currentRoute !== 'advertiser') history.push(BUY_SELL_URL);
                            onRequestClose();
                        }}
                        size='lg'
                        textSize={textSize}
                        type='button'
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button disabled={!isValid || !isDirty || isError} size='lg' textSize={textSize} type='submit'>
                        <Localize i18n_default_text='Confirm' />
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default NicknameModal;
