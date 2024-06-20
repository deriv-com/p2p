import clsx from 'clsx';
import { Localize } from '@deriv-com/translations';
import { Text, ToggleSwitch, useDevice } from '@deriv-com/ui';

type TMyAdsToggleProps = {
    isPaused: boolean;
    onClickToggle: () => void;
};
const MyAdsToggle = ({ isPaused, onClickToggle }: TMyAdsToggleProps) => {
    const { isMobile } = useDevice();
    return (
        <div className={clsx('flex gap-[1.6rem] items-center', { 'justify-end w-full': isMobile })}>
            <Text color={isPaused ? 'success' : 'less-prominent'} size={isMobile ? 'md' : 'sm'}>
                <Localize i18n_default_text='Hide my ads' />
            </Text>
            <ToggleSwitch onChange={onClickToggle} value={isPaused} />
        </div>
    );
};
export default MyAdsToggle;
