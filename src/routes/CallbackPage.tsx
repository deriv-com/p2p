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
                const isTMBEnabled = localStorage.getItem('is_tmb_enabled');
                if (isTMBEnabled) {
                    const activeTokens = JSON.parse(localStorage.getItem('clientAccounts') || '[]');
                    const selectedAuthToken = activeTokens?.find(
                        (item: { cur: string; loginid: string; token: string }) =>
                            item.cur === 'USD' && item.loginid?.includes('CR')
                    )?.token;

                    localStorage.setItem('authToken', selectedAuthToken);
                } else {
                    const groupedTokens = groupTokens(tokens);
                    localStorage.setItem('clientAccounts', JSON.stringify(groupedTokens));

                    const selectedAuthToken =
                        groupedTokens.find(item => item.cur === 'USD' && item.acct?.includes('CR'))?.token ||
                        tokens.token1;

                    localStorage.setItem('authToken', selectedAuthToken);
                }

                window.location.href = '/';
            }}
        />
    );
};

export default memo(CallbackPage);
