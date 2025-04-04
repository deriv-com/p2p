import React from 'react';
import clsx from 'clsx';

type TButtonProps = {
    className?: string;
    icon?: React.ReactNode;
    isDisabled?: boolean;
    isHidden?: boolean;
    label?: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
    secondary?: boolean;
    small?: boolean;
    text?: string;
};

const Button = ({
    children,
    className,
    icon,
    isDisabled,
    isHidden,
    label,
    onClick,
}: React.PropsWithChildren<TButtonProps>) => (
    <React.Fragment>
        {!isHidden && (
            <span
                className={clsx('dc-calendar__btn', className, {
                    'dc-calendar__btn--disabled': isDisabled,
                    'dc-calendar__btn--is-hidden': isHidden,
                })}
                onClick={onClick}
            >
                {label}
                {icon}
                {children}
            </span>
        )}
    </React.Fragment>
);

export default Button;
