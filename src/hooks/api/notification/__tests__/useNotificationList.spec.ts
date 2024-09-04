import { renderHook } from '@testing-library/react';
import useNotificationList from '../useNotificationList';

const mockNotificationListData = {
    data: {
        notifications_list: {
            messages: [
                {
                    category: 'see',
                    message_key: 'p2p-limit-upgrade-available',
                },
                {
                    category: 'see',
                    message_key: 'poi-verified',
                },
            ],
        },
    },
};

jest.mock('@deriv-com/api-hooks', () => ({
    useSubscribe: jest.fn(() => mockNotificationListData),
}));

describe('useNotificationList', () => {
    it('should return the list of p2p-related notifications', () => {
        const { result } = renderHook(() => useNotificationList());

        expect(result.current.data).toEqual([
            {
                category: 'see',
                message_key: 'p2p-limit-upgrade-available',
            },
        ]);
    });
});
