import { DerivLogo, useDevice } from '@deriv-com/ui';
import './AppLogo.scss';

export const AppLogo = () => {
    const { isDesktop } = useDevice();

    if (!isDesktop) return null;
    return <DerivLogo className='app-header__logo' href={URLConstant.DerivComProduction} target='_blank' variant='wallets' />;
};
