import { memo } from 'react';
import { Callback } from '@deriv-com/auth-client';

const CallbackPage = () => {
    return (
        <Callback
            onSignInSuccess={tokens => {
                localStorage.setItem('authToken', tokens.token1);

                window.location.href = '/';
            }}
        />
    );
};

export default memo(CallbackPage);
