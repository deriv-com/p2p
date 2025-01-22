import { memo, useEffect } from 'react';
import { NonUndefined } from 'react-hook-form';
import { THooks, TLocalize } from 'types';
import { Table } from '@/components';
import { api } from '@/hooks';
import { useGetPhoneNumberVerification, useIsAdvertiser } from '@/hooks/custom-hooks';
import { useTranslations } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { MyAdsEmpty } from '../../MyAdsEmpty';
import MyAdsTableRowView from '../MyAdsTableRow/MyAdsTableRowView';
import MyAdsDisplayWrapper from './MyAdsDisplayWrapper';
import './MyAdsTable.scss';

type TAdvertiserPaymentMethods = THooks.AdvertiserPaymentMethods.Get;

export type TMyAdsTableRowRendererProps = NonUndefined<THooks.AdvertiserAdverts.Get>[0] & {
    advertiserPaymentMethods: TAdvertiserPaymentMethods;
    balanceAvailable: number;
    dailyBuyLimit: number;
    dailySellLimit: number;
    isBarred: boolean;
    isListed: boolean;
};

const MyAdsTableRowRenderer = memo((values: TMyAdsTableRowRendererProps) => <MyAdsTableRowView {...values} />);
MyAdsTableRowRenderer.displayName = 'MyAdsTableRowRenderer';

const headerRenderer = (header: string) => <span>{header}</span>;

const getColumns = (localize: TLocalize) => [
    { header: localize('Ad ID') },
    { header: localize('Limits') },
    { header: localize('Rate (1 USD)') },
    { header: localize('Available amount') },
    { header: localize('Payment methods') },
    { header: localize('Status') },
];

const MyAdsTable = () => {
    const isAdvertiser = useIsAdvertiser();
    const { data = [], isFetching, isLoading, loadMoreAdverts } = api.advertiserAdverts.useGet(undefined, isAdvertiser);
    const { data: advertiserInfo } = api.advertiser.useGetInfo();
    const {
        balance_available: balanceAvailable,
        blocked_until: blockedUntil,
        daily_buy: dailyBuy = 0,
        daily_buy_limit: dailyBuyLimit = 0,
        daily_sell: dailySell = 0,
        daily_sell_limit: dailySellLimit = 0,
        isListedBoolean: isListed,
    } = advertiserInfo || {};
    const { mutate: updateAds } = api.advertiser.useUpdate();
    const { data: advertiserPaymentMethods, get } = api.advertiserPaymentMethods.useGet();
    const { localize } = useTranslations();
    const { isPhoneNumberVerified } = useGetPhoneNumberVerification();

    useEffect(() => {
        if (isAdvertiser) {
            get();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdvertiser]);

    if (isLoading && isFetching) return <Loader />;

    if (!data.length) return <MyAdsEmpty />;

    const onClickToggle = () => updateAds({ is_listed: isListed ? 0 : 1 });

    return (
        <MyAdsDisplayWrapper
            isDisabled={!isPhoneNumberVerified}
            isPaused={!!blockedUntil || !isListed}
            onClickToggle={onClickToggle}
        >
            <div className='my-ads-table__list'>
                <Table
                    columns={getColumns(localize)}
                    data={data}
                    loadMoreFunction={loadMoreAdverts}
                    renderHeader={headerRenderer}
                    rowRender={(rowData: unknown) => (
                        <MyAdsTableRowRenderer
                            {...(rowData as TMyAdsTableRowRendererProps)}
                            advertiserPaymentMethods={advertiserPaymentMethods as TAdvertiserPaymentMethods}
                            balanceAvailable={balanceAvailable ?? 0}
                            dailyBuyLimit={Number(dailyBuyLimit) - Number(dailyBuy)}
                            dailySellLimit={Number(dailySellLimit) - Number(dailySell)}
                            isBarred={!!blockedUntil}
                            isListed={!!isListed}
                        />
                    )}
                    tableClassname=''
                />
            </div>
        </MyAdsDisplayWrapper>
    );
};

export default MyAdsTable;
