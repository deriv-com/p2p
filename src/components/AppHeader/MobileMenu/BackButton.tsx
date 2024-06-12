import { LegacyChevronLeft1pxIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

type TBackButton = {
    buttonText: string;
    onClick: () => void;
};

export const BackButton = ({ buttonText, onClick }: TBackButton) => (
    <button className='flex items-center w-full pt-[20px] p-[32px]' onClick={onClick}>
        <LegacyChevronLeft1pxIcon iconSize='xs' />

        <Text className='text-[16px] ml-[16px]' weight='bold'>
            {buttonText}
        </Text>
    </button>
);
