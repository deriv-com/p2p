import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';

type TPreferredCountriesFooterProps = {
    isDisabled: boolean;
    onClickApply: () => void;
    onClickClear: () => void;
};

const PreferredCountriesFooter = ({ isDisabled, onClickApply, onClickClear }: TPreferredCountriesFooterProps) => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    return (
        <div className='flex gap-[0.8rem] w-full'>
            <Button
                color='black'
                disabled={isDisabled}
                isFullWidth
                onClick={onClickClear}
                size='lg'
                textSize={textSize}
                variant='outlined'
            >
                <Localize i18n_default_text='Clear' />
            </Button>
            <Button
                disabled={isDisabled}
                isFullWidth
                onClick={onClickApply}
                size='lg'
                textSize={textSize}
                variant='contained'
            >
                <Localize i18n_default_text='Apply' />
            </Button>
        </div>
    );
};

export default PreferredCountriesFooter;
