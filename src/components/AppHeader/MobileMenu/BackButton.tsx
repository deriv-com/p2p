import { LegacyChevronLeft1pxIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';

type TBackButton = {
    buttonText: string;
    onClick: () => void;
};

export const BackButton = ({ buttonText, onClick }: TBackButton) => (
    <button className='flex items-center w-full pt-[2rem] p-[3.2rem]' onClick={onClick}>
        <LegacyChevronLeft1pxIcon iconSize='xs' />

        <Text className='text-[1.6rem] ml-[1.6rem]' weight='bold'>
            {buttonText}
        </Text>
    </button>
);
