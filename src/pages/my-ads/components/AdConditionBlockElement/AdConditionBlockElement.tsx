import clsx from 'clsx';
import { Text, useDevice } from '@deriv-com/ui';
import './AdConditionBlockElement.scss';

type TAdConditionBlockElementProps = {
    isSelected: boolean;
    label: string;
    onClick: (value: number) => void;
    value: number;
};

const AdConditionBlockElement = ({ isSelected, label, onClick, value }: TAdConditionBlockElementProps) => {
    const { isDesktop } = useDevice();
    return (
        <div
            className={clsx('ad-condition-block-element', {
                'ad-condition-block-element--selected': isSelected,
            })}
            onClick={() => onClick(value)}
        >
            <Text color={isSelected ? 'white' : 'prominent'} size={isDesktop ? 'md' : 'lg'}>
                {label}
            </Text>
        </div>
    );
};

export default AdConditionBlockElement;
