import { memo, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useFetchMore } from '@/hooks/custom-hooks';
import { Text, useDevice } from '@deriv-com/ui';
import { ColumnDef, getCoreRowModel, getGroupedRowModel, GroupingState, useReactTable } from '@tanstack/react-table';
import './Table.scss';

type TProps<T> = {
    columns?: ColumnDef<T>[];
    data: T[];
    emptyDataMessage?: string;
    groupBy?: GroupingState;
    isFetching: boolean;
    loadMoreFunction: () => void;
    renderHeader?: (data: string) => JSX.Element;
    rowRender: (data: T) => JSX.Element;
    tableClassname: string;
};

const Table = <T,>({
    columns = [],
    data,
    emptyDataMessage,
    loadMoreFunction,
    renderHeader = () => <div />,
    rowRender,
    tableClassname,
}: TProps<T>) => {
    const { isDesktop } = useDevice();
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel<T>(),
        getGroupedRowModel: getGroupedRowModel<T>(),
    });

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if (headerRef?.current) {
            const topPosition = headerRef.current.getBoundingClientRect().bottom;
            setHeight(window.innerHeight - topPosition);
        }
    }, [headerRef?.current]);

    const { fetchMoreOnBottomReached } = useFetchMore({
        loadMore: loadMoreFunction,
        ref: tableContainerRef,
    });

    return (
        <div className='h-full w-full'>
            {isDesktop && columns.length > 0 && (
                <div className='table__header' ref={headerRef}>
                    {table.getFlatHeaders().map(header => (
                        <Text className='table__header-items' key={header.id} size='sm' weight='bold'>
                            {renderHeader(header.column.columnDef.header as string)}
                        </Text>
                    ))}
                </div>
            )}
            <div
                className={clsx('table__content', tableClassname)}
                onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
                ref={tableContainerRef}
                style={{ height: isDesktop && columns.length > 0 ? `calc(${height}px - 3.6rem)` : '100%' }}
            >
                {data && data.length > 0 ? (
                    table.getRowModel().rows.map(row => (
                        <div className='table__content-row' data-testid='dt_table_content_row' key={row.id}>
                            {rowRender(row.original)}
                        </div>
                    ))
                ) : (
                    <Text
                        className='w-full flex items-center justify-center border-b-[1px] border-solid border-b-[#f2f3f4] p-[1.6rem]'
                        size='sm'
                    >
                        {emptyDataMessage}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default memo(Table);
