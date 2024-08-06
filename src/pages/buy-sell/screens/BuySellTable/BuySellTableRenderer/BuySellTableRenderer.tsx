import { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { TAdvertsTableRowRenderer, TLocalize } from 'types';
import { AdvertsTableRow, Table } from '@/components';
import { MY_ADS_URL } from '@/constants';
import { useIsAdvertiserBarred } from '@/hooks';
import { DerivLightIcCashierNoAdsIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, Loader, Text, useDevice } from '@deriv-com/ui';

const headerRenderer = (header: string) => <span>{header}</span>;

const getColumns = (localize: TLocalize) => [
    { header: localize('Advertisers') },
    { header: localize('Limits') },
    { header: localize('Rate (1 USD)') },
    { header: localize('Payment methods') },
];

type TBuySellTableRowRendererProps = {
    data?: TAdvertsTableRowRenderer[];
    isFetching: boolean;
    isLoading: boolean;
    loadMoreAdverts: () => void;
    searchValue: string;
};

const BuySellTableRenderer = ({
    data = [],
    isFetching,
    isLoading,
    loadMoreAdverts,
    searchValue,
}: TBuySellTableRowRendererProps) => {
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const history = useHistory();
    const isAdvertiserBarred = useIsAdvertiserBarred();

    if (isLoading) {
        return <Loader className='mt-80' />;
    }

    if ((!data && !searchValue) || (data.length === 0 && !searchValue)) {
        return (
            <div className='mt-[5.5rem] lg:mt-10'>
                <ActionScreen
                    actionButtons={
                        <Button
                            disabled={isAdvertiserBarred}
                            onClick={() => history.push(MY_ADS_URL)}
                            size='lg'
                            textSize={isMobile ? 'md' : 'sm'}
                        >
                            <Localize i18n_default_text='Create ad' />
                        </Button>
                    }
                    description={
                        <Text align='center' as='div' className='w-[32rem] md:w-full'>
                            <Localize i18n_default_text='Looking to buy or sell USD? You can post your own ad for others to respond.' />
                        </Text>
                    }
                    icon={<DerivLightIcCashierNoAdsIcon height='128px' width='128px' />}
                    title={
                        <Text weight='bold'>
                            <Localize i18n_default_text='No ads for this currency 😞' />
                        </Text>
                    }
                />
            </div>
        );
    }

    return (
        <Table
            columns={getColumns(localize)}
            data={data}
            emptyDataMessage={localize('There are no matching ads.')}
            isFetching={isFetching}
            loadMoreFunction={loadMoreAdverts}
            renderHeader={headerRenderer}
            rowRender={(data: unknown) => <AdvertsTableRow {...(data as TAdvertsTableRowRenderer)} />}
            tableClassname=''
        />
    );
};

export default memo(BuySellTableRenderer);
