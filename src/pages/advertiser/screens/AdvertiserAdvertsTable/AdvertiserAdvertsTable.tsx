import { ADVERT_TYPE, BUY_SELL } from '@/constants';
import { api } from '@/hooks';
import { useQueryString } from '@/hooks/custom-hooks';
import { Tab, Tabs } from '@deriv-com/ui';
import { AdvertsTableRenderer } from './AdvertsTableRenderer';
import './AdvertiserAdvertsTable.scss';

type TAdvertiserAdvertsTableProps = {
    advertiserId: string;
};

const TABS = [ADVERT_TYPE.BUY, ADVERT_TYPE.SELL];

const AdvertiserAdvertsTable = ({ advertiserId }: TAdvertiserAdvertsTableProps) => {
    const { queryString, setQueryString } = useQueryString();
    const activeTab = queryString?.tab || ADVERT_TYPE.BUY;

    const { data, isFetching, isLoading, loadMoreAdverts } = api.advert.useGetList({
        advertiser_id: advertiserId,
        counterparty_type: activeTab === ADVERT_TYPE.BUY ? BUY_SELL.BUY : BUY_SELL.SELL,
    });

    const setActiveTab = (index: number) => setQueryString({ tab: TABS[index] });

    return (
        <div className='advertiser-adverts-table'>
            <Tabs activeTab={activeTab} className='lg:w-80 lg:mt-10' onChange={setActiveTab} variant='secondary'>
                <Tab className='text-xs' title='Buy' />
                <Tab title='Sell' />
            </Tabs>
            <AdvertsTableRenderer
                data={data}
                isFetching={isFetching}
                isLoading={isLoading}
                loadMoreAdverts={loadMoreAdverts}
            />
        </div>
    );
};

export default AdvertiserAdvertsTable;
