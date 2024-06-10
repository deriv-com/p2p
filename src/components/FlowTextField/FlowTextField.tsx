import React, { forwardRef, Ref, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Text } from '@deriv-com/ui';
import WalletTextField, { WalletTextFieldProps } from '../Base/WalletTextField/WalletTextField';
import { useFlow } from '../FlowProvider';
import { TextField } from '../TextField';

export interface TFlowFieldProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    name: string;
    validationSchema?: Yup.AnySchema;
}

/**
 * This component is just a wrapper to the Field Formik component and WalletTextField
 * Use this component when you are using the FlowProvider with a form and several inputs,
 * and you want those input values to be tracked and validated
 */
const FlowTextField = forwardRef(
    (
        { defaultValue, disabled, errorMessage, isInvalid, name, validationSchema, ...rest }: TFlowFieldProps,
        ref: Ref<HTMLInputElement>
    ) => {
        const { control } = useForm();
        const [hasTouched, setHasTouched] = useState(false);
        const { setFormValues } = useFlow();

        const validateField = (value: unknown) => {
            try {
                if (validationSchema) {
                    validationSchema.validateSync(value);
                }
            } catch (err: unknown) {
                return (err as Yup.ValidationError).message;
            }
        };

        useEffect(() => {
            const setFormValuesAndTouch = async () => {
                if (defaultValue) {
                    await setFormValues(name, defaultValue, true);
                    console.log('asdfasdf');
                }
            };

            setFormValuesAndTouch();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <Controller
                control={control}
                name='amount'
                render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                    return (
                        <div className='px-[1.6rem] lg:px-[2.4rem] pr-6 '>
                            <Text
                                {...rest}
                                defaultValue={defaultValue}
                                disabled={disabled}
                                errorMessage={hasTouched && (form.errors[name] || errorMessage)}
                                isInvalid={(hasTouched && isInvalid) || (hasTouched && Boolean(form.errors[name]))}
                                name={field.name}
                                onChange={field.onChange}
                                onFocus={e => {
                                    setHasTouched(true);
                                    field.onBlur(e);
                                }}
                                ref={ref}
                            />
                        </div>
                    );
                }}
            />
        );
    }
);

FlowTextField.displayName = 'FlowTextField';
export default FlowTextField;
