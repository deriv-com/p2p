import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ACCOUNT_TYPES, CURRENCIES } from '@/constants';
import { useIsLoadingOidcStore } from '@/stores';
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
    const { setIsCheckingOidcTokens } = useIsLoadingOidcStore(
        useShallow(state => ({
            setIsCheckingOidcTokens: state.setIsCheckingOidcTokens,
        }))
    );
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
                setIsCheckingOidcTokens(false);
            }}
        />
    );
};

export default memo(CallbackPage);
