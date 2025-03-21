import { memo } from 'react';
import { Callback } from '@deriv-com/auth-client';

type TTokens = {
    [key: string]: string | undefined;
};

const groupTokens = (tokens: TTokens) => {
    const grouped: { acct?: string; cur?: string; token?: string }[] = [];

    for (let i = 1; i <= 3; i++) {
        grouped.push({
            acct: tokens[`acct${i}`],
            cur: tokens[`cur${i}`],
            token: tokens[`token${i}`],
        });
    }

    return grouped;
};

const CallbackPage = () => {
    return (
        <Callback
            onSignInSuccess={tokens => {
                const groupedTokens = groupTokens(tokens);
                const selectedAuthToken = groupedTokens.find(item => item.cur === 'USD')?.token || tokens.token1;

                localStorage.setItem('authToken', selectedAuthToken);

                window.location.href = '/';
            }}
        />
    );
};

export default memo(CallbackPage);
