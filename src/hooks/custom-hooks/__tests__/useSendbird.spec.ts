import SendbirdChat from '@sendbird/chat';
import { renderHook, waitFor } from '@testing-library/react';
import useSendbird from '../useSendbird';

jest.mock('../../', () => ({
    ...jest.requireActual('../../'),
    api: {
        account: {
            useSendbirdServiceToken: jest.fn().mockReturnValue({
                data: {
                    app_id: 'A123-456-789',
                    expiry_time: 1234567890,
                    token: '0123445678901234567890',
                },
                isSuccess: true,
            }),
            useServerTime: jest.fn().mockReturnValue({
                data: {
                    server_time: 1234567890,
                    server_time_utc: 1719832008000,
                },
            }),
        },
        advertiser: {
            useGetInfo: jest.fn().mockReturnValue({
                data: {
                    chat_user_id: 'chat_user_id1',
                    id: 'id1',
                },
            }),
        },
        chat: {
            useCreate: jest.fn().mockReturnValue({
                isError: false,
                mutate: jest.fn(),
            }),
        },
    },
}));

jest.mock('@sendbird/chat', () => ({
    init: jest.fn().mockReturnValue({
        connect: jest.fn().mockReturnValue(undefined),
        disconnect: jest.fn(),
        groupChannel: {
            addGroupChannelHandler: jest.fn(),
            getChannel: jest.fn().mockReturnValue(undefined),
        },
    }),
    SendBirdAction: {
        ChannelHandler: jest.fn().mockReturnValue({
            onMessageReceived: jest.fn(),
        }),
    },
}));

const mockSendBirdChatApi = SendbirdChat as jest.Mocked<typeof SendbirdChat>;

const mockUserValues = {
    _iid: 'id1',
    connectionStatus: 'nonavailable',
    friendDiscoveryKey: null,
    friendName: null,
    isActive: true,
    lastSeenAt: null,
    metaData: {},
    nickname: 'client CR90000562',
    plainProfileUrl: '',
    preferredLanguages: [],
    requireAuth: false,
    userId: 'p2puser_CR_92_1719813335',
};

const mockChannelValues = {
    _createdAt: 1719816440000,
    _iid: 'id1',
    _lastMemberCountUpdated: 0,
    _messageCollectionLastAccessedAt: 0,
    _myMutedRemainingTime: -1,
    _name: 'Chat about order 34',
    _pinnedMessagesUpdatedAt: 0,
    _typingEnded: 0,
    _typingStarted: 0,
    _typingStatus: {},
    _undeliveredMemberStateMap: {},
    _unreadMemberStateMap: {},
    _url: 'p2porder_CR_34_1719816439',
    channelType: 'group',
    coverUrl: 'https://static.sendbird.com/sample/cover/cover_11.jpg',
    createdAt: 1719816440000,
    creator: null,
    customType: '',
    data: '',
    hiddenState: 'unhidden',
    invitedAt: 1719816440289,
    inviter: null,
    isAccessCodeRequired: false,
    isBroadcast: false,
    isChatNotification: false,
    isDiscoverable: false,
    isDistinct: false,
    isEphemeral: false,
    isExclusive: false,
    isFrozen: false,
    isPublic: false,
    isPushEnabled: true,
    isSuper: false,
    joinedAt: 1719816440,
    joinedMemberCount: 2,
    lastMessage: null,
    lastPinnedMessage: null,
    memberCount: 2,
    members: [
        {
            _iid: 'id2',
            connectionStatus: 'offline',
            friendDiscoveryKey: null,
            friendName: null,
            isActive: true,
            isBlockedByMe: false,
            isBlockingMe: false,
            isMuted: false,
            lastSeenAt: -1,
            metaData: {},
            nickname: 'client CR90000101',
            plainProfileUrl: '',
            preferredLanguages: null,
            requireAuth: false,
            restrictionInfo: {
                description: null,
                endAt: -1,
                remainingDuration: -1,
                restrictionType: null,
            },
            role: null,
            state: 'joined',
            userId: 'p2puser_CR_19_1719783873',
        },
    ],
    messageOffsetTimestamp: 0,
    messageSurvivalSeconds: -1,
    myCountPreference: 'all',
    myLastRead: 1719816440289,
    myMemberState: 'joined',
    myMutedState: 'unmuted',
    myPushTriggerOption: 'default',
    myRole: 'none',
    name: 'Chat about order 34',
    pinnedMessageIds: [],
    totalUnreadReplyCount: 0,
    unreadMentionCount: 0,
    unreadMessageCount: 0,
    url: 'p2porder_CR_34_1719816439',
};

const mockRetrievedMessages = [
    {
        _iid: 'fthft4',
        channelType: 'group',
        channelUrl: 'chatchannelurl',
        createdAt: 1719829975618,
        customType: '',
        data: '1719829975217test message channel1',
        errorCode: 0,
        isFileMessage: jest.fn(() => false),
        isUserMessage: jest.fn(() => true),
        mentionType: 'users',
        message: 'test message channel',
        messageId: 1719829975217,
        messageType: 'user',
        sender: {
            _iid: 'rthhhrth',
            isActive: true,
            nickname: 'client CR90000562',
            userId: 'p2puser_CR_92_1719813335',
        },
        sendingStatus: 'succeeded',
        updatedAt: 0,
    },
];

describe('useSendbird', () => {
    it('should return isError as true when there is error in orderInfo', async () => {
        const { result } = renderHook(() => useSendbird('id1', true, 'chatchannelurl'));

        expect(result.current.isError).toBeTruthy();
    });

    it('should return isError as true when no user is returned', async () => {
        const { result } = renderHook(() => useSendbird('id1', false, 'chatchannelurl'));
        await waitFor(() => {
            expect(result.current.isError).toBeTruthy();
        });
    });

    it('should return isError as true, when no channel is returned', async () => {
        // @ts-expect-error only necessary properties are mocked
        mockSendBirdChatApi.init.mockReturnValue({
            connect: jest.fn().mockReturnValue(mockUserValues),
            disconnect: jest.fn(),
            groupChannel: {
                addGroupChannelHandler: jest.fn(),
                getChannel: jest.fn().mockReturnValue(undefined),
            },
        });
        const { result } = renderHook(() => useSendbird('id1', false, 'chatchannelurl'));
        await waitFor(() => {
            expect(result.current.isError).toBeTruthy();
        });
    });

    it('should return the active chat channel', async () => {
        // @ts-expect-error only necessary properties are mocked
        mockSendBirdChatApi.init.mockReturnValue({
            connect: jest.fn().mockReturnValue(mockUserValues),
            disconnect: jest.fn(),
            groupChannel: {
                addGroupChannelHandler: jest.fn(),
                getChannel: jest.fn().mockReturnValue(mockChannelValues),
            },
        });
        const { result } = renderHook(() => useSendbird('id1', false, 'chatchannelurl'));
        await waitFor(() => {
            expect(result.current.activeChatChannel).toBe(mockChannelValues);
        });
    });

    it('should return the messages', async () => {
        // @ts-expect-error only necessary properties are mocked
        mockSendBirdChatApi.init.mockReturnValue({
            connect: jest.fn().mockReturnValue(mockUserValues),
            disconnect: jest.fn(),
            groupChannel: {
                addGroupChannelHandler: jest.fn(),
                getChannel: jest.fn().mockReturnValue({
                    ...mockChannelValues,
                    getMessagesByTimestamp: jest.fn().mockReturnValue(mockRetrievedMessages),
                }),
            },
        });
        const { result } = renderHook(() => useSendbird('id1', false, 'chatchannelurl'));

        await waitFor(() => {
            expect(result.current.messages).toEqual([
                expect.objectContaining({
                    message: 'test message channel',
                }),
            ]);
        });
    });

    it('should handle sendMessage', async () => {
        const mockFn = jest.fn();
        // @ts-expect-error only necessary properties are mocked
        mockSendBirdChatApi.init.mockReturnValue({
            connect: jest.fn().mockReturnValue(mockUserValues),
            disconnect: jest.fn(),
            groupChannel: {
                addGroupChannelHandler: jest.fn(),
                getChannel: jest.fn().mockReturnValue({
                    ...mockChannelValues,
                    getMessagesByTimestamp: jest.fn().mockReturnValue(mockRetrievedMessages),
                    sendUserMessage: mockFn.mockImplementation(params => {
                        const message = {
                            id: params.data, // Assuming data is used as id
                            isFileMessage: () => false,
                            isUserMessage: () => true,
                            message: params.message,
                            messageId: 1719829975217,
                        };

                        // Simulate onSucceeded callback
                        const onSucceeded = (
                            handler: (message: {
                                id: string;
                                isFileMessage: () => void;
                                isUserMessage: () => void;
                                message: string;
                            }) => void
                        ) => {
                            handler(message); // Simulate invoking onSucceeded with mock message
                            return {
                                onFailed: () => {},
                                onPending: () => {},
                                onSucceeded: () => {},
                            };
                        };

                        return {
                            onFailed: () => {},
                            onPending: () => {},
                            onSucceeded,
                        };
                    }),
                }),
            },
        });
        const { result } = renderHook(() => useSendbird('id1', false, 'chatchannelurl'));

        await waitFor(() => {
            result.current.sendMessage('message to send');
            expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ message: 'message to send' }));
        });
    });

    it('should handle sendFileMessage', async () => {
        const mockFn = jest.fn();
        // @ts-expect-error only necessary properties are mocked
        mockSendBirdChatApi.init.mockReturnValue({
            connect: jest.fn().mockReturnValue(mockUserValues),
            disconnect: jest.fn(),
            groupChannel: {
                addGroupChannelHandler: jest.fn(),
                getChannel: jest.fn().mockReturnValue({
                    ...mockChannelValues,
                    getMessagesByTimestamp: jest.fn().mockReturnValue(mockRetrievedMessages),
                    sendFileMessage: mockFn.mockImplementation(({ file, fileName, fileSize, mimeType }) => {
                        const sentMessage = {
                            channelUrl: 'mockChannelUrl',
                            file,
                            fileName,
                            fileSize,
                            isFileMessage: () => true, // Mocking isFileMessage for success case
                            mimeType,
                        };

                        // Simulate onPending callback
                        const onPending = (handler: () => void) => {
                            handler(); // Call the handler
                            return { onFailed, onPending, onSucceeded };
                        };

                        // Simulate onSucceeded callback
                        const onSucceeded = (
                            handler: (arg0: {
                                channelUrl: string;
                                file: File;
                                fileName: string;
                                fileSize: number;
                                isFileMessage: () => boolean;
                                mimeType: string;
                            }) => void
                        ) => {
                            handler(sentMessage);
                            return { onFailed, onPending, onSucceeded };
                        };

                        const onFailed = (handler: () => void) => {
                            handler(); // Call the handler
                            return { onFailed, onPending, onSucceeded };
                        };
                        return {
                            onFailed,
                            onPending,
                            onSucceeded,
                        };
                    }),
                }),
            },
        });
        const { result } = renderHook(() => useSendbird('id1', false, 'chatchannelurl'));
        const file = new File([''], 'filename');

        await waitFor(() => {
            result.current.sendFile(file);
            expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({ file }));
        });
    });
});
