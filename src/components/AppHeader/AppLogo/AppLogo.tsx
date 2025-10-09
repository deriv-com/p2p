import { DERIV_COM } from '@/constants';
import { DerivLogo, useDevice } from '@deriv-com/ui';
import './AppLogo.scss';

const AppLogo = () => {
    const { isDesktop } = useDevice();

    if (!isDesktop) return null;
    return <DerivLogo className='app-header__logo' href={DERIV_COM} target='_blank' variant='wallets' />;
};

export default AppLogo;
