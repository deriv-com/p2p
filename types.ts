/* eslint-disable @typescript-eslint/no-namespace */
import { ComponentProps } from 'react';
import { AD_CONDITION_TYPES, ERROR_CODES } from '@/constants';
import { api } from '@/hooks';
import { useSendbirdServiceToken } from '@/hooks/api/account';
import { useAdvertiserStats, useSendbird } from '@/hooks/custom-hooks';
import { useP2PCountryList } from '@deriv-com/api-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
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
export type TPaymentMethod = THooks.PaymentMethods.Get[number];

export type TAdvertiserStats = ReturnType<typeof useAdvertiserStats>['data'];

export type TSelectedPaymentMethod = Partial<{
    displayName: string;
    fields: THooks.PaymentMethods.Get[number]['fields'];
    id: THooks.PaymentMethods.Get[number]['id'];
    method: THooks.AdvertiserPaymentMethods.Get[number]['method'];
}>;

export type TAdvertsTableRowRenderer = THooks.Advert.GetList[number];

export type NonUndefinedValues<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
};

export type TAdvertType = THooks.Advert.Get;

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
        export type Create = NonNullable<ReturnType<typeof api.advert.useCreate>['mutate']>;
        export type Update = NonNullable<ReturnType<typeof api.advert.useUpdate>['mutate']>;
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
        export type Dispute = NonNullable<ReturnType<typeof api.orderDispute.useDispute>['mutate']>;
    }
    export namespace Order {
        export type Cancel = NonNullable<ReturnType<typeof api.order.useCancel>['data']>;
        export type Confirm = NonNullable<ReturnType<typeof api.order.useConfirm>['data']>;
        export type Create = NonNullable<ReturnType<typeof api.order.useCreate>['mutate']>;
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
        export type Get = NonNullable<ReturnType<typeof useP2PCountryList>['data']>;
    }
}
export type TOrders = NonNullable<ReturnType<typeof api.order.useGetList>['data']>;

export type TStep = {
    header: {
        title: string;
    };
    subStepCount?: number;
};

export type TCountryListItem = {
    [key: string]: {
        country_name: string;
        cross_border_ads_enabled: 0 | 1;
        fixed_rate_adverts: 'disabled' | 'enabled';
        float_rate_adverts: 'disabled' | 'enabled';
        float_rate_offset_limit: number;
        local_currency: TCurrency;
        payment_methods: {
            [key: string]: TPaymentMethod;
        };
    };
};

export type DeepPartial<T> = T extends Date | bigint | boolean | number | string | symbol | null | undefined
    ? T | undefined
    : T extends (infer ArrayType)[]
      ? DeepPartial<ArrayType>[]
      : T extends readonly (infer ArrayType)[]
        ? readonly ArrayType[]
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
    selectedPaymentMethod?: DeepPartial<NonNullable<TAdvertiserPaymentMethod | TPaymentMethod>>;
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
     * Error message from useSubscription response
     */
    message?: string;
    /**
     * Action name of the request made.
     */
    msg_type: T;
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
};

export type WithRequiredProperty<T, Key extends keyof T> = T & {
    [K in Key]-?: T[K];
};

export type TCurrency = CurrencyConstants.Currency;

export type MutableOption = { text?: JSX.Element | string; value?: string | undefined };

export type TErrorCodes = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type TTextColors = ComponentProps<typeof Text>[`color`];

export type TFileType = 'file' | 'image' | 'pdf';

export type TSendBirdServiceToken = ReturnType<typeof useSendbirdServiceToken>['data'];

export type TAdConditionTypes = (typeof AD_CONDITION_TYPES)[keyof typeof AD_CONDITION_TYPES];

export type TWalletType = 'bank' | 'ewallet' | 'other';

export type TPaymentFieldType = 'memo' | 'text';

export type TType01 = 0 | 1;

export type TOrderStatus = THooks.Order.Get['status'];

export type TAdvertiserPaymentMethod = THooks.AdvertiserPaymentMethods.Get[number];

export type TBankName = THooks.AdvertiserPaymentMethods.Get[number]['fields']['bank_name'];
export type TName = THooks.AdvertiserPaymentMethods.Get[number]['fields']['name'];
export type TAccount = THooks.AdvertiserPaymentMethods.Get[number]['fields']['account'];

export type TTextSize = ComponentProps<typeof Text>['size'];

export type TActiveChannel = ReturnType<typeof useSendbird>['activeChatChannel'];
export type TChatMessages = NonNullable<ReturnType<typeof useSendbird>['messages']>;

export type TLocalize = ReturnType<typeof useTranslations>['localize'];

export type TOrderExpiryOptions = NonNullable<
    NonNullable<ReturnType<typeof api.settings.useSettings>>['data']
>['order_expiry_options'];

export type TOrderIdsMap = {
    [key: string]: string[];
};
