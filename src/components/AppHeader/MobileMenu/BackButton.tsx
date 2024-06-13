import { LegacyChevronLeft1pxIcon } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';

type TBackButton = {
    buttonText: string;
    onClick: () => void;
};

export const BackButton = ({ buttonText, onClick }: TBackButton) => {
    const { isMobile } = useDevice();

    return (
        <button className='flex items-center w-full pt-[2rem] p-[3.2rem]' onClick={onClick}>
            <LegacyChevronLeft1pxIcon iconSize='xs' />

            <Text className='ml-[1.6rem]' size={isMobile ? 'lg' : 'md'} weight='bold'>
                {buttonText}
            </Text>
        </button>
    );
};
