import { ReactElement, Suspense, useEffect, useState } from 'react';

type CurrencyIconProps = {
    currency: string;
    isVirtual: boolean;
};

const CurrencyIcon = ({ currency, isVirtual }: CurrencyIconProps) => {
    const [currencyIconComponent, setCurrencyIconComponent] = useState<ReactElement | null>(null);

    useEffect(() => {
        const currencyName = currency.charAt(0).toUpperCase() + currency.slice(1).toLowerCase();
        const currencyIconName = isVirtual ? 'CurrencyDemoIcon' : `Currency${currencyName}Icon`;
        const getIconComponent = async () => {
            const module = await import('@deriv/quill-icons');
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            const IconComponent = (module as any)[currencyIconName];

            setCurrencyIconComponent(<IconComponent iconSize='sm' />);
        };

        getIconComponent();
    }, []);

    return <Suspense fallback={<div />}>{currencyIconComponent}</Suspense>;
};

export default CurrencyIcon;
