import { memo } from 'react';
import { Callback } from '@deriv-com/auth-client';

type TTokens = {
    [key: string]: string | undefined;
};

const groupTokens = (tokens: TTokens) => {
    const grouped: { acct?: string; cur?: string; token?: string }[] = [];
    const totalEntries = Object.keys(tokens).length;
    const numGroups = Math.floor(totalEntries / 3);

    for (let i = 1; i <= numGroups; i++) {
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
                const selectedAuthToken =
                    groupedTokens.find(item => item.cur === 'USD' && item.acct === 'CR')?.token || tokens.token1;

                localStorage.setItem('authToken', selectedAuthToken);

                window.location.href = '/';
            }}
        />
    );
};

export default memo(CallbackPage);
