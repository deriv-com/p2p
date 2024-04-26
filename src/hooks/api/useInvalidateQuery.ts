import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type TOptions = Parameters<ReturnType<typeof useQueryClient>['invalidateQueries']>[1];

const useInvalidateQuery = () => {
    const queryClient = useQueryClient();

    const invalidate = useCallback(
        <T>(name: T | T[], options?: TOptions) => {
            return queryClient.invalidateQueries({ queryKey: [name], ...options });
        },
        [queryClient]
    );

    return invalidate;
};

export default useInvalidateQuery;
