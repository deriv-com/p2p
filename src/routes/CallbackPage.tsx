import { memo } from 'react';
import { ACCOUNT_TYPES, CURRENCIES } from '@/constants';
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
                localStorage.setItem('clientAccounts', JSON.stringify(groupedTokens));

                const selectedAuthToken =
                    groupedTokens.find(
                        item =>
                            item.cur &&
                            CURRENCIES.includes(item.cur) &&
                            ACCOUNT_TYPES.some(accountType => item.acct?.includes(accountType))
                    )?.token || tokens.token1;

                localStorage.setItem('authToken', selectedAuthToken);

                window.location.replace('/');
            }}
        />
    );
};

export default memo(CallbackPage);
