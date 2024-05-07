import { RefObject, useCallback, useEffect } from 'react';

type TProps = {
    loadMore: () => void;
    ref: RefObject<HTMLDivElement>;
};

/** A custom hook to load more items in the table on scroll to bottom of the table */
const useFetchMore = ({ loadMore, ref }: TProps) => {
    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { clientHeight, scrollHeight, scrollTop } = containerRefElement;
                //once the user has scrolled within 200px of the bottom of the table, fetch more data if we can
                const isBottom = scrollHeight - scrollTop <= clientHeight + 200;

                if (isBottom) {
                    loadMore();
                }
            }
        },
        [loadMore]
    );

    useEffect(() => {
        const currentRef = ref.current;
        const handleScroll = () => fetchMoreOnBottomReached(currentRef);

        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [fetchMoreOnBottomReached, ref]);

    return {
        fetchMoreOnBottomReached,
    };
};

export default useFetchMore;
