import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { api } from '@/hooks';
import { DerivLightIcBlockedAdvertisersBarredIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Loader, Table, Text, useDevice } from '@deriv-com/ui';
import { MyProfileCounterpartiesEmpty } from '../MyProfileCounterpartiesEmpty';
import { MyProfileCounterpartiesTableRow } from '../MyProfileCounterpartiesTableRow';
import './MyProfileCounterpartiesTable.scss';

type TMyProfileCounterpartiesTableProps = {
    dropdownValue: string;
    searchValue: string;
    setShowHeader: (show: boolean) => void;
};

type TMyProfileCounterpartiesTableRowRendererProps = {
    id?: string;
    is_blocked: boolean;
    name?: string;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
};

const MyProfileCounterpartiesTableRowRenderer = ({
    id,
    is_blocked: isBlocked,
    name,
    setErrorMessage,
}: TMyProfileCounterpartiesTableRowRendererProps) => (
    <MyProfileCounterpartiesTableRow
        id={id ?? ''}
        isBlocked={isBlocked}
        nickname={name ?? ''}
        setErrorMessage={setErrorMessage}
    />
);

const MyProfileCounterpartiesTable = ({
    dropdownValue,
    searchValue,
    setShowHeader,
}: TMyProfileCounterpartiesTableProps) => {
    const {
        data = [],
        isFetching,
        isLoading,
        loadMoreAdvertisers,
    } = api.advertiser.useGetList({
        advertiser_name: searchValue,
        is_blocked: dropdownValue === 'blocked' ? 1 : 0,
        trade_partners: 1,
    });
    const [errorMessage, setErrorMessage] = useState<string | undefined>('');
    const { isDesktop } = useDevice();

    useEffect(() => {
        if (data.length > 0) {
            setShowHeader(true);
        }
        if (errorMessage) {
            setShowHeader(false);
        }
    }, [data, errorMessage, setShowHeader]);

    if (isLoading) {
        return <Loader className='my-profile-counterparties-table__loader' isFullScreen={false} />;
    }

    if (!isFetching && data.length === 0) {
        if (searchValue === '') return <MyProfileCounterpartiesEmpty />;
        return (
            <Text className='pt-12' weight={isDesktop ? 'bold' : 'normal'}>
                <Localize i18n_default_text='There are no matching name.' />
            </Text>
        );
    }

    if (errorMessage) {
        return (
            <div className='flex flex-col items-center lg:px-[11rem] px-[1.6rem]'>
                <DerivLightIcBlockedAdvertisersBarredIcon height={128} width={128} />
                <Text align='center' className='mt-[3rem]' size={isDesktop ? 'md' : 'lg'} weight='bold'>
                    {errorMessage}
                </Text>
            </div>
        );
    }

    return (
        <Table
            data={data}
            loadMoreFunction={loadMoreAdvertisers}
            rowRender={(rowData: unknown) => (
                <MyProfileCounterpartiesTableRowRenderer
                    {...(rowData as TMyProfileCounterpartiesTableRowRendererProps)}
                    setErrorMessage={setErrorMessage}
                />
            )}
            tableClassname='my-profile-counterparties-table'
        />
    );
};

export default MyProfileCounterpartiesTable;
