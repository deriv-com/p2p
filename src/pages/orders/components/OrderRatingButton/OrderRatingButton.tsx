import { MouseEventHandler } from 'react';
import { LabelPairedStarLgFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';

type TOrderRatingButtonProps = {
    isDetails?: boolean;
    isDisabled?: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
};

const OrderRatingButton = ({ isDetails = false, isDisabled, onClick }: TOrderRatingButtonProps) => {
    const { isDesktop } = useDevice();

    return (
        <Button
            className='ml-8 w-fit border-[1px]'
            color='black'
            disabled={isDisabled}
            onClick={onClick}
            type='button'
            variant='outlined'
        >
            <Text className='flex gap-2' size={isDesktop ? 'xs' : 'sm'} weight={isDetails ? 'normal' : 'bold'}>
                <LabelPairedStarLgFillIcon fill='#FFAD3A' height={16} width={16} />
                <Localize i18n_default_text='Rate' />
            </Text>
        </Button>
    );
};

export default OrderRatingButton;
