import { useEffect } from 'react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { FullPageMobileWrapper } from '@/components';
import { api } from '@/hooks';
import { useQueryString } from '@/hooks/custom-hooks';
import { LabelPairedCheckMdFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Loader, Text, useDevice } from '@deriv-com/ui';
import { MyProfileAdDetailsTextArea } from './MyProfileAdDetailsTextArea';
import './MyProfileAdDetails.scss';

const MyProfileAdDetails = () => {
    const { data: advertiserInfo, isLoading } = api.advertiser.useGetInfo();
    const { isSuccess, mutate: updateAdvertiser, reset } = api.advertiser.useUpdate();
    const { isDesktop, isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    const {
        control,
        formState: { isDirty, isValid },
        getValues,
        handleSubmit,
        reset: resetForm,
        watch,
    } = useForm({
        defaultValues: {
            ad_details_contact: advertiserInfo?.contact_info,
            ad_details_description: advertiserInfo?.default_advert_description,
        },
        mode: 'onChange',
    });

    const debouncedReset = debounce(() => {
        reset();
        resetForm(watch(), { keepDefaultValues: false, keepDirty: false, keepValues: false });
    }, 2000);

    const isButtonDisabled = !isDirty || !isValid || isSuccess;
    const saveButtonClass = clsx({ 'my-profile-ad-details__button--submitting': isSuccess });
    const buttonIcon = isSuccess ? <LabelPairedCheckMdFillIcon fill='#fff' /> : null;

    useEffect(() => {
        if (isSuccess) debouncedReset();
    }, [debouncedReset, isSuccess]);

    const submitAdDetails = () => {
        updateAdvertiser({
            contact_info: getValues('ad_details_contact'),
            default_advert_description: getValues('ad_details_description'),
        });
    };

    if (isLoading && !advertiserInfo) return <Loader className='mt-16' />;

    if (!isDesktop) {
        return (
            <form onSubmit={handleSubmit(submitAdDetails)}>
                <FullPageMobileWrapper
                    className='my-profile-ad-details__mobile-wrapper'
                    onBack={() =>
                        setQueryString({
                            tab: 'default',
                        })
                    }
                    renderFooter={() => (
                        <Button
                            className={saveButtonClass}
                            disabled={!isDirty || !isValid || isSuccess}
                            icon={buttonIcon}
                            isFullWidth
                            size='lg'
                        >
                            <Localize i18n_default_text='Save' />
                        </Button>
                    )}
                    renderHeader={() => (
                        <Text size={isMobile ? 'lg' : 'md'} weight='bold'>
                            <Localize i18n_default_text='Ad Details ' />
                        </Text>
                    )}
                >
                    <div className='my-profile-ad-details'>
                        <MyProfileAdDetailsTextArea control={control as unknown as Control<FieldValues>} />
                    </div>
                </FullPageMobileWrapper>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit(submitAdDetails)}>
            <div className='my-profile-ad-details'>
                <MyProfileAdDetailsTextArea control={control as unknown as Control<FieldValues>} />
                <div className='my-profile-ad-details__border' />
                <Button
                    className={saveButtonClass}
                    disabled={isButtonDisabled}
                    icon={buttonIcon}
                    size='lg'
                    textSize='sm'
                >
                    <Localize i18n_default_text='Save' />
                </Button>
            </div>
        </form>
    );
};

export default MyProfileAdDetails;
