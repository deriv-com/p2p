import { memo, useEffect } from 'react';
import { NonUndefined } from 'react-hook-form';
import { THooks } from 'types';
import { Table } from '@/components';
import { api } from '@/hooks';
import { useIsAdvertiser } from '@/hooks/custom-hooks';
import { Loader } from '@deriv-com/ui';
import { MyAdsEmpty } from '../../MyAdsEmpty';
import MyAdsTableRowView from '../MyAdsTableRow/MyAdsTableRowView';
import MyAdsDisplayWrapper from './MyAdsDisplayWrapper';
import './MyAdsTable.scss';

type TAdvertiserPaymentMethods = THooks.AdvertiserPaymentMethods.Get;

export type TMyAdsTableRowRendererProps = NonUndefined<THooks.AdvertiserAdverts.Get>[0] & {
    advertiserPaymentMethods: TAdvertiserPaymentMethods;
    balanceAvailable: number;
    dailyBuyLimit: string;
    dailySellLimit: string;
    isBarred: boolean;
    isListed: boolean;
};

const MyAdsTableRowRenderer = memo((values: TMyAdsTableRowRendererProps) => <MyAdsTableRowView {...values} />);
MyAdsTableRowRenderer.displayName = 'MyAdsTableRowRenderer';

const headerRenderer = (header: string) => <span>{header}</span>;

const columns = [
    {
        header: 'Ad ID',
    },
    {
        header: 'Limits',
    },
    {
        header: 'Rate (1 USD)',
    },
    {
        header: 'Available amount',
    },
    {
        header: 'Payment methods',
    },
    {
        header: 'Status',
    },
];

const MyAdsTable = () => {
    const isAdvertiser = useIsAdvertiser();
    const { data = [], isFetching, isLoading, loadMoreAdverts } = api.advertiserAdverts.useGet(undefined, isAdvertiser);
    const { data: advertiserInfo } = api.advertiser.useGetInfo();
    const {
        balance_available: balanceAvailable,
        blocked_until: blockedUntil,
        daily_buy_limit: dailyBuyLimit,
        daily_sell_limit: dailySellLimit,
        isListedBoolean: isListed,
    } = advertiserInfo || {};
    const { mutate: updateAds } = api.advertiser.useUpdate();
    const { data: advertiserPaymentMethods, get } = api.advertiserPaymentMethods.useGet();

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
        <MyAdsDisplayWrapper isPaused={!!blockedUntil || !isListed} onClickToggle={onClickToggle}>
            <div className='my-ads-table__list'>
                <Table
                    columns={columns}
                    data={data}
                    isFetching={isFetching}
                    loadMoreFunction={loadMoreAdverts}
                    renderHeader={headerRenderer}
                    rowRender={(rowData: unknown) => (
                        <MyAdsTableRowRenderer
                            {...(rowData as TMyAdsTableRowRendererProps)}
                            advertiserPaymentMethods={advertiserPaymentMethods as TAdvertiserPaymentMethods}
                            balanceAvailable={balanceAvailable ?? 0}
                            dailyBuyLimit={dailyBuyLimit ?? ''}
                            dailySellLimit={dailySellLimit ?? ''}
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
