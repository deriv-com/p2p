import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Table } from '@/components';
import { ERROR_CODES } from '@/constants';
import { api } from '@/hooks';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { useErrorStore } from '@/stores';
import { getInvalidIDErrorMessage } from '@/utils';
import { DerivLightIcBlockedAdvertisersBarredIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Loader, Text, useDevice } from '@deriv-com/ui';
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
};

const MyProfileCounterpartiesTableRowRenderer = ({
    id,
    is_blocked: isBlocked,
    name,
}: TMyProfileCounterpartiesTableRowRendererProps) => (
    <MyProfileCounterpartiesTableRow id={id ?? ''} isBlocked={isBlocked} nickname={name ?? ''} />
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
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { errorMessages, reset } = useErrorStore(
        useShallow(state => ({ errorMessages: state.errorMessages, reset: state.reset }))
    );
    const isAdvertiserBarred = useIsAdvertiserBarred();
    const error = errorMessages.find(
        error =>
            error.code === ERROR_CODES.TEMPORARY_BAR ||
            error.code === ERROR_CODES.PERMISSION_DENIED ||
            error.code === ERROR_CODES.INVALID_ADVERTISER_ID
    );
    const errorMessage = getInvalidIDErrorMessage(error, localize);

    useEffect(() => {
        if (data.length > 0) {
            setShowHeader(true);
        }
        if (errorMessage) {
            setShowHeader(false);
        }
    }, [data, errorMessage, setShowHeader]);

    useEffect(() => {
        if (!isAdvertiserBarred && errorMessages.some(error => error.code === ERROR_CODES.TEMPORARY_BAR)) {
            setShowHeader(true);
            reset();
        }
    }, [errorMessage, errorMessages, isAdvertiserBarred, reset, setShowHeader]);

    useEffect(() => {
        // Reset error messages when the component unmounts for non-temporary bar errors
        return () => {
            if (errorMessages.some(error => error.code !== ERROR_CODES.TEMPORARY_BAR)) {
                setShowHeader(true);
                reset();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                />
            )}
            tableClassname='my-profile-counterparties-table'
        />
    );
};

export default MyProfileCounterpartiesTable;
