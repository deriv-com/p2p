/**
 * Converts a number into a string of US-supported currency format. For example:
 * 10000 => 10,000.00

 * @param value - The numerical currency value to convert to US-supported currency format
 * @returns 
 */
export const numberToCurrencyText = (value: number) =>
    new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'decimal',
    }).format(value);

export type TCurrenciesConfig = {
    [key: string]: {
        fractionalDigits: number;
        isDepositSuspended?: 0 | 1;
        isSuspended?: 0 | 1;
        isWithdrawalSuspended?: 0 | 1;
        name?: string;
        stakeDefault?: number;
        transferBetweenAccounts?: {
            fees?: { [key: string]: number };
            limits: {
                [key: string]: unknown;
                max?: number;
                min: number;
            } | null;
            limitsDxtrade?: { [key: string]: unknown };
            limitsMt5?: { [key: string]: unknown };
        };
        type: string;
    };
};
