/* eslint-disable @typescript-eslint/no-namespace */
import { api } from '@/hooks';
import { useAdvertiserStats } from '@/hooks/custom-hooks';
import { useExchangeRates } from '@deriv-com/api-hooks';
import { CurrencyConstants } from '@deriv-com/utils';

declare global {
    interface WindowEventMap {
        queryChange: CustomEvent;
    }
}

export type TAccumulatedPaymentMethods = Record<
    string,
    (THooks.AdvertiserPaymentMethods.Get | THooks.PaymentMethods.Get)[number]
>;
export type TPaymentMethod = THooks.AdvertiserPaymentMethods.Get[number] | THooks.PaymentMethods.Get[number];

export type TAdvertiserStats = ReturnType<typeof useAdvertiserStats>['data'];

export type TSelectedPaymentMethod = Partial<{
    displayName: string;
    fields: THooks.PaymentMethods.Get[number]['fields'];
    id: THooks.PaymentMethods.Get[number]['id'];
    method: THooks.AdvertiserPaymentMethods.Get[number]['method'];
}>;

export type TAdvertsTableRowRenderer = Partial<THooks.Advert.GetList[number]>;

export type NonUndefinedValues<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
};

export type TAdvertType = NonUndefinedValues<THooks.Advert.Get>;

export type TCurrencyListItem = {
    display_name: string;
    has_adverts: 0 | 1;
    is_default?: 1;
    text: string;
    value: string;
};

export type TServerTime = ReturnType<typeof api.account.useServerTime>['data'];

export namespace THooks {
    export namespace AdvertiserAdverts {
        export type Get = NonNullable<ReturnType<typeof api.advertiserAdverts.useGet>['data']>;
    }
    export namespace Advert {
        export type Get = NonNullable<ReturnType<typeof api.advert.useGet>['data']>;
        export type GetList = NonNullable<ReturnType<typeof api.advert.useGetList>['data']>;
        export type Create = NonNullable<ReturnType<typeof api.advert.useCreate>['data']>;
        export type Update = NonNullable<ReturnType<typeof api.advert.useUpdate>['data']>;
        export type Delete = NonNullable<ReturnType<typeof api.advert.useDelete>['data']>;
    }
    export namespace Advertiser {
        export type GetInfo = NonNullable<ReturnType<typeof api.advertiser.useGetInfo>['data']>;
        export type GetList = NonNullable<ReturnType<typeof api.advertiser.useGetList>['data']>;
        export type Create = NonNullable<ReturnType<typeof api.advertiser.useCreate>['data']>;
        export type Update = NonNullable<ReturnType<typeof api.advertiser.useUpdate>['data']>;
    }
    export namespace Counterparty {
        export type Get = NonNullable<ReturnType<typeof api.counterparty.useGet>['data']>;
        export type Block = NonNullable<ReturnType<typeof api.counterparty.useBlock>['data']>;
        export type Unblock = NonNullable<ReturnType<typeof api.counterparty.useUnblock>['data']>;
    }
    export namespace OrderDispute {
        export type Dispute = NonNullable<ReturnType<typeof api.orderDispute.useDispute>['data']>;
    }
    export namespace Order {
        export type Cancel = NonNullable<ReturnType<typeof api.order.useCancel>['data']>;
        export type Confirm = NonNullable<ReturnType<typeof api.order.useConfirm>['data']>;
        export type Create = NonNullable<ReturnType<typeof api.order.useCreate>['data']>;
        export type Get = NonNullable<ReturnType<typeof api.order.useGet>['data']>;
        export type GetList = NonNullable<ReturnType<typeof api.order.useGetList>['data']>;
    }
    export namespace PaymentMethods {
        export type Get = NonNullable<ReturnType<typeof api.paymentMethods.useGet>['data']>;
    }
    export namespace AdvertiserPaymentMethods {
        export type Get = NonNullable<ReturnType<typeof api.advertiserPaymentMethods.useGet>['data']>;
        export type Create = NonNullable<ReturnType<typeof api.advertiserPaymentMethods.useCreate>['data']>;
        export type Update = NonNullable<ReturnType<typeof api.advertiserPaymentMethods.useUpdate>['data']>;
        export type Delete = NonNullable<ReturnType<typeof api.advertiserPaymentMethods.useDelete>['data']>;
    }
    export namespace Settings {
        export type Get = NonNullable<ReturnType<typeof api.settings.useSettings>['data']>;
    }
    export namespace Country {
        export type Get = NonNullable<ReturnType<typeof api.countryList.useGet>['data']>;
    }
}
export type TOrders = NonNullable<ReturnType<typeof api.order.useGetList>['data']>;

export type TStep = {
    header: {
        title: string;
    };
    subStepCount?: number;
};

export type TCountryListItem = THooks.Country.Get;

export type DeepPartial<T> = T extends string | number | bigint | boolean | null | undefined | symbol | Date
    ? T | undefined
    : T extends Array<infer ArrayType>
      ? Array<DeepPartial<ArrayType>>
      : T extends ReadonlyArray<infer ArrayType>
        ? ReadonlyArray<ArrayType>
        : T extends Set<infer SetType>
          ? Set<DeepPartial<SetType>>
          : T extends ReadonlySet<infer SetType>
            ? ReadonlySet<SetType>
            : T extends Map<infer KeyType, infer ValueType>
              ? Map<DeepPartial<KeyType>, DeepPartial<ValueType>>
              : T extends ReadonlyMap<infer KeyType, infer ValueType>
                ? ReadonlyMap<DeepPartial<KeyType>, DeepPartial<ValueType>>
                : { [K in keyof T]?: DeepPartial<T[K]> };

export type TFormState = {
    actionType?: 'ADD' | 'DELETE' | 'EDIT' | 'RESET';
    isVisible?: boolean;
    selectedPaymentMethod?: DeepPartial<NonNullable<TPaymentMethod>>;
    title?: string;
};

export type TReducerAction = {
    payload?: {
        formState?: TFormState;
        selectedPaymentMethod?: DeepPartial<TSelectedPaymentMethod>;
    };
    type: TFormState['actionType'];
};

//TODO: add the type accordingly and remove this once imported from api-hooks
export type TSocketError<T> = {
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Error object.
     */
    error: {
        code: string;
        message: string;
    };
    /**
     * Action name of the request made.
     */
    msg_type: T;
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
    /**
     * Error message from useSubscription response
     */
    message?: string;
};

export type WithRequiredProperty<T, Key extends keyof T> = T & {
    [K in Key]-?: T[K];
};

export type TCurrency = CurrencyConstants.Currency;

export type TExchangeRate = ReturnType<typeof useExchangeRates>['exchangeRates'];

export type MutableOption = { text?: React.ReactNode; value?: string | undefined };
