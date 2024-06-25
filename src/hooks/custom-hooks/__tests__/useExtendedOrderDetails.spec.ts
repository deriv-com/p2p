import moment from 'moment';
import { THooks, TServerTime } from 'types';
import { renderHook } from '@testing-library/react';
import useExtendedOrderDetails from '../useExtendedOrderDetails';

const mockData: {
    loginId: string;
    orderDetails: THooks.Order.Get;
    serverTime: TServerTime;
} = {
    loginId: '123',
    orderDetails: {
        account_currency: 'USD',
        // @ts-expect-error - Only relevant fields are included
        advertiser_details: {
            loginid: '',
        },
        amount_display: '100',
        type: 'buy',
    },
    serverTime: undefined,
};

describe('useExtendedOrderDetails', () => {
    describe('counterpartyAdStatusString', () => {
        it('should return correct strings for buy order', () => {
            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.counterpartyAdStatusString).toEqual({
                contactDetails: "Seller's contact details",
                counterpartyNicknameLabel: "Seller's nickname",
                counterpartyRealNameLabel: "Seller's real name",
                instructions: "Seller's instructions",
                leftSendOrReceive: 'Send',
                paymentDetails: "Seller's payment details",
                resultString: "You've received USD 100",
                rightSendOrReceive: 'Receive',
            });
        });

        it('should return correct strings for sell order', () => {
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.counterpartyAdStatusString).toEqual({
                contactDetails: 'Your contact details',
                counterpartyNicknameLabel: "Buyer's nickname",
                counterpartyRealNameLabel: "Buyer's real name",
                instructions: "Buyer's instructions",
                leftSendOrReceive: 'Receive',
                paymentDetails: 'Your payment details',
                resultString: 'You sold USD 100',
                rightSendOrReceive: 'Send',
            });
        });
    });

    describe('displayPaymentAmount', () => {
        it('should return an empty string if rate is undefined', () => {
            // Rate is undefined by default in beforeEach setup

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.displayPaymentAmount).toBe('');
        });

        it('should return the correct amount if rate is defined', () => {
            mockData.orderDetails.rate = 1.5;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.displayPaymentAmount).toBe('150.00 ');
        });
    });

    describe('hasReviewDetails', () => {
        it('should return review_details if it is defined', () => {
            mockData.orderDetails.review_details = {
                created_time: 1627584000,
                has_not_been_recommended: true,
                is_recommended: true,
                rating: 5,
                recommended: null,
            };

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.hasReviewDetails).toBe(true);
        });
    });

    describe('hasTimerExpired', () => {
        it('should return false if server_time_moment is undefined', () => {
            // server_time_moment is undefined by default in beforeEach setup

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.hasTimerExpired).toBe(false);
        });

        it('should return true if serverTime is after expiry_time', () => {
            mockData.orderDetails.expiry_time = 1627584000;
            mockData.serverTime = {
                server_time_moment: moment.unix(1637584000),
                server_time_utc: 1637584000,
            };

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.hasTimerExpired).toBe(true);
        });
    });

    describe('isActiveOrder', () => {
        it('should return true if order status is not completed, cancelled, refunded, dispute completed, or dispute refunded', () => {
            // Status is not set by default, implying an active order

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isActiveOrder).toBe(true);
        });

        it('should return false if order status is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isActiveOrder).toBe(false);
        });
    });

    describe('isBuyerCancelledOrder', () => {
        it('should return true if status is cancelled', () => {
            mockData.orderDetails.status = 'cancelled';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isBuyerCancelledOrder).toBe(true);
        });
    });

    describe('isBuyerConfirmedOrder', () => {
        it('should return true if status is buyer-confirmed', () => {
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isBuyerConfirmedOrder).toBe(true);
        });
    });

    describe('isBuyOrder', () => {
        it('should return true if order type is buy', () => {
            mockData.orderDetails.type = 'buy';
            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isBuyOrder).toBe(true);
        });
    });

    describe('isBuyOrderForUser', () => {
        it("should return true if order type is buy and loginId doesn't match advertiser_details.loginid", () => {
            mockData.orderDetails.advertiser_details.loginid = '456';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isBuyOrderForUser).toBe(true);
        });

        it('should return true if order type is sell and loginId matches advertiser_details.loginid', () => {
            mockData.orderDetails.type = 'sell';
            mockData.orderDetails.advertiser_details.loginid = '123';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isBuyOrderForUser).toBe(true);
        });
    });

    describe('isCompletedOrder', () => {
        it('should return true if order status is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isCompletedOrder).toBe(true);
        });
    });

    describe('isDisputeCompletedOrder', () => {
        it('should return true if order status is dispute-completed', () => {
            mockData.orderDetails.status = 'dispute-completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isDisputeCompletedOrder).toBe(true);
        });
    });

    describe('isDisputedOrder', () => {
        it('should return true if order status is disputed', () => {
            mockData.orderDetails.status = 'disputed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isDisputedOrder).toBe(true);
        });
    });

    describe('isDisputeRefundedOrder', () => {
        it('should return true if order status is dispute-refunded', () => {
            mockData.orderDetails.status = 'dispute-refunded';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isDisputeRefundedOrder).toBe(true);
        });
    });

    describe('isExpiredOrder', () => {
        it('should return true if order status is timed-out', () => {
            mockData.orderDetails.status = 'timed-out';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isExpiredOrder).toBe(true);
        });
    });

    describe('isExpiredOrOngoingTimerExpired', () => {
        it('should return true if order status is timed-out', () => {
            mockData.orderDetails.status = 'timed-out';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isExpiredOrOngoingTimerExpired).toBe(true);
        });

        it('should return true if serverTime is after expiry_time and status is buyer-confirmed', () => {
            mockData.orderDetails.expiry_time = 1627584000;
            mockData.serverTime = {
                server_time_moment: moment.unix(1637584000),
                server_time_utc: 1637584000,
            };
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isExpiredOrOngoingTimerExpired).toBe(true);
        });
    });

    describe('isFinalisedOrder', () => {
        it('should return true if order status is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isFinalisedOrder).toBe(true);
        });

        it('should return true if order status is cancelled', () => {
            mockData.orderDetails.status = 'cancelled';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isFinalisedOrder).toBe(true);
        });

        it('should return true if order status is refunded', () => {
            mockData.orderDetails.status = 'refunded';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isFinalisedOrder).toBe(true);
        });
    });

    describe('isInactiveOrder', () => {
        it('should return true if order status is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isInactiveOrder).toBe(true);
        });

        it('should return true if order status is dispute-completed', () => {
            mockData.orderDetails.status = 'dispute-completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isInactiveOrder).toBe(true);
        });

        it('should return true if order status is dispute-refunded', () => {
            mockData.orderDetails.status = 'dispute-refunded';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isInactiveOrder).toBe(true);
        });
    });

    describe('isIncomingOrder', () => {
        it('should return true if is_incoming is true', () => {
            mockData.orderDetails.is_incoming = true;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isIncomingOrder).toBe(true);
        });
    });

    describe('isMyAd', () => {
        it('should return true if advertiser_details.loginid matches loginId', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isMyAd).toBe(true);
        });
    });

    describe('isOngoingOrder', () => {
        it('should return true if order status is buyer-confirmed', () => {
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isOngoingOrder).toBe(true);
        });

        it('should return true if order status is cancelled', () => {
            mockData.orderDetails.status = 'cancelled';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isOngoingOrder).toBe(true);
        });
    });

    describe('isOrderReviewable', () => {
        it('should return true if is_reviewable is true', () => {
            mockData.orderDetails.is_reviewable = true;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isOrderReviewable).toBe(true);
        });
    });

    describe('isPendingOrder', () => {
        it('should return true if order status is pending', () => {
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isPendingOrder).toBe(true);
        });
    });

    describe('isRefundedOrder', () => {
        it('should return true if order status is refunded', () => {
            mockData.orderDetails.status = 'refunded';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isRefundedOrder).toBe(true);
        });
    });

    describe('isSellOrder', () => {
        it('should return true if order type is sell', () => {
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.isSellOrder).toBe(true);
        });
    });

    describe('labels', () => {
        it('should return correct labels if it is your ad', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.labels).toEqual({
                contactDetails: "Seller's contact details",
                counterpartyNicknameLabel: "Seller's nickname",
                counterpartyRealNameLabel: "Seller's real name",
                instructions: 'Your instructions',
                leftSendOrReceive: 'Send',
                paymentDetails: "Seller's payment details",
                resultString: "You've received USD 100",
                rightSendOrReceive: 'Receive',
            });
        });

        it('should return correct labels if it is not your ad', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.labels).toEqual({
                contactDetails: 'Your contact details',
                counterpartyNicknameLabel: "Buyer's nickname",
                counterpartyRealNameLabel: "Buyer's real name",
                instructions: "Buyer's instructions",
                leftSendOrReceive: 'Receive',
                paymentDetails: 'Your payment details',
                resultString: 'You sold USD 100',
                rightSendOrReceive: 'Send',
            });
        });
    });

    describe('myAdStatusString', () => {
        it('should return correct strings for buy order', () => {
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.myAdStatusString).toEqual({
                contactDetails: 'Your contact details',
                counterpartyNicknameLabel: "Buyer's nickname",
                counterpartyRealNameLabel: "Buyer's real name",
                instructions: 'Your instructions',
                leftSendOrReceive: 'Receive',
                paymentDetails: 'Your payment details',
                resultString: 'You sold USD 100',
                rightSendOrReceive: 'Send',
            });
        });

        it('should return correct strings for sell order', () => {
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.myAdStatusString).toEqual({
                contactDetails: "Seller's contact details",
                counterpartyNicknameLabel: "Seller's nickname",
                counterpartyRealNameLabel: "Seller's real name",
                instructions: 'Your instructions',
                leftSendOrReceive: 'Send',
                paymentDetails: "Seller's payment details",
                resultString: "You've received USD 100",
                rightSendOrReceive: 'Receive',
            });
        });
    });

    describe('orderExpiryMilliseconds', () => {
        it('should return 0 if expiry_time is undefined', () => {
            // @ts-expect-error - expiry_time is set to undefined for testing
            mockData.orderDetails.expiry_time = undefined;
            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.orderExpiryMilliseconds).toBe(0);
        });

        it('should return the correct milliseconds if expiry_time is defined', () => {
            mockData.orderDetails.expiry_time = 1627584000;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.orderExpiryMilliseconds).toBe(1627584000000);
        });
    });

    describe('otherUserDetails', () => {
        it('should return client_details if isMyAd is true', () => {
            // @ts-expect-error - client_details values are mocked
            mockData.orderDetails.client_details = {
                name: 'John Doe',
            };
            // @ts-expect-error - advertiser_details values are mocked
            mockData.orderDetails.advertiser_details = {
                name: 'Jane Doe',
            };
            mockData.orderDetails.advertiser_details.loginid = '123';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.otherUserDetails).toEqual(mockData.orderDetails.client_details);
        });

        it('should return advertiser_details if isMyAd is false', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.otherUserDetails).toEqual(mockData.orderDetails.advertiser_details);
        });
    });

    describe('purchaseTime', () => {
        it('should return default time if created_time is undefined', () => {
            // @ts-expect-error - created_time is set to undefined for testing
            mockData.orderDetails.created_time = undefined;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.purchaseTime).toBe('01 Jan 1970');
        });

        it('should return the correct time if created_time is defined', () => {
            mockData.orderDetails.created_time = 1627650000;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.purchaseTime).toBe('30 Jul 2021');
        });
    });

    describe('rateAmount', () => {
        it('should return an empty string if rate is undefined', () => {
            // @ts-expect-error - rate is set to undefined for testing
            mockData.orderDetails.rate = undefined;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.rateAmount).toBe('');
        });

        it('should return the correct amount if rate is defined', () => {
            mockData.orderDetails.rate = 1.5;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.rateAmount).toBe('1.50 ');
        });
    });

    describe('shouldHighlightAlert', () => {
        it('should return false if timer has expired', () => {
            mockData.orderDetails.expiry_time = 1627584000;
            mockData.serverTime = {
                server_time_moment: moment.unix(1627584001),
                server_time_utc: 1627584001,
            };

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightAlert).toBe(false);
        });

        it('should return true if isMyAd, isBuyOrder, and isPendingOrder are true and timer has not expired', () => {
            mockData.orderDetails.expiry_time = 1637584000;
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'buy';
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightAlert).toBe(true);
        });

        it('should return true if isMyAd, isSellOrder, and isBuyerConfirmedOrder are true and timer has not expired', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'sell';
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightAlert).toBe(true);
        });

        it('should return true if it is not your ad, isBuyOrder, and isBuyerConfirmedOrder are true and timer has not expired', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'buy';
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightAlert).toBe(true);
        });

        it('should return true if it is not your ad, isSellOrder, and isPendingOrder are true and timer has not expired', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'sell';
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightAlert).toBe(true);
        });
    });

    describe('shouldHighlightDanger', () => {
        it('should return false if timer has not expired', () => {
            mockData.orderDetails.expiry_time = 1627584000;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDanger).toBe(false);
        });

        it('should return true if isMyAd, isBuyOrder, isBuyerConfirmedOrder are true and timer has expired', () => {
            mockData.orderDetails.expiry_time = 1637584000;
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'buy';
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDanger).toBe(true);
        });

        it('should return true if isMyAd, isSellOrder, and isPendingOrder are true and timer has expired', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'sell';
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDanger).toBe(true);
        });

        it('should return true if it is not your ad, isBuyOrder, and isPendingOrder are true and timer has expired', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'buy';
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDanger).toBe(true);
        });

        it('should return true if it is not your ad, isSellOrder, and isBuyerConfirmedOrder are true and timer has expired', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'sell';
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDanger).toBe(true);
        });
    });

    describe('shouldHighlightDisabled', () => {
        it('should return false if isBuyerCanelled, isExpiredOrder, isRefundedOrder, isDisputedOrder, isDisputeCompletedOrder, isDisputeRefundedOrder are false, timer not expired, order is not complete', () => {
            mockData.orderDetails.expiry_time = 1637584000;
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDisabled).toBe(false);
        });

        it('should return true if isBuyerCanelled is true', () => {
            mockData.orderDetails.status = 'cancelled';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDisabled).toBe(true);
        });

        it('should return true if timer has expired, order is not completed and is not a disputed order', () => {
            mockData.orderDetails.status = 'pending';
            mockData.orderDetails.expiry_time = 1627584000;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightDisabled).toBe(true);
        });
    });

    describe('shouldHighlightSuccess', () => {
        it('should return true if status is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightSuccess).toBe(true);
        });

        it('should return true if status is dispute-completed', () => {
            mockData.orderDetails.status = 'dispute-completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldHighlightSuccess).toBe(true);
        });
    });

    describe('shouldShowCancelAndPaidButton', () => {
        it('should return false if timer has expired', () => {
            mockData.orderDetails.expiry_time = 1627584000;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowCancelAndPaidButton).toBe(false);
        });

        it('should return true if status is pending, isMyAd is false, and isBuyOrder is true', () => {
            mockData.orderDetails.expiry_time = 1637584000;
            mockData.orderDetails.status = 'pending';
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowCancelAndPaidButton).toBe(true);
        });

        it('should return true if status is pending, isMyAd is true, and isSellOrder is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowCancelAndPaidButton).toBe(true);
        });
    });

    describe('shouldShowComplainAndReceivedButton', () => {
        it('should return false if isFinalisedOrder is true', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowComplainAndReceivedButton).toBe(false);
        });

        it('should return true if order has expired, isSellOrder and isMyAd is false', () => {
            mockData.orderDetails.status = 'timed-out';
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowComplainAndReceivedButton).toBe(true);
        });

        it('should return true if order has expired, isBuyOrder and isMyAd is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowComplainAndReceivedButton).toBe(true);
        });
    });

    describe('shouldShowLostFundsBanner', () => {
        it('should return true if status is pending', () => {
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowLostFundsBanner).toBe(true);
        });

        it('should return true if status is buyer-confirmed', () => {
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowLostFundsBanner).toBe(true);
        });
    });

    describe('shouldShowOnlyComplainButton', () => {
        it('should return false if order is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOnlyComplainButton).toBe(false);
        });

        it('should return true if isSellOrder and status is expired', () => {
            mockData.orderDetails.status = 'timed-out';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOnlyComplainButton).toBe(true);
        });

        it('should return true if isBuyOrder and status is expired and isMyAd is false', () => {
            mockData.orderDetails.status = 'timed-out';
            mockData.orderDetails.type = 'buy';
            mockData.orderDetails.advertiser_details.loginid = '456';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOnlyComplainButton).toBe(true);
        });
    });

    describe('shouldShowOnlyReceivedButton', () => {
        it('should return true if status is disputed, isIncomingOrder is false and isSellOrder is true', () => {
            mockData.orderDetails.status = 'disputed';
            mockData.orderDetails.is_incoming = false;
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOnlyReceivedButton).toBe(true);
        });

        it('should return true if status is disputed, isIncomingOrder is true and isBuyOrder is true', () => {
            mockData.orderDetails.is_incoming = true;
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOnlyReceivedButton).toBe(true);
        });

        it('should return true if status is buyer-confirmed, isBuyOrder is true, and isMyAd is true', () => {
            mockData.orderDetails.status = 'buyer-confirmed';
            mockData.orderDetails.advertiser_details.loginid = '123';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOnlyReceivedButton).toBe(true);
        });

        it('should return true if status is buyer-confirmed, isSellOrder is true, and isMyAd is false', () => {
            mockData.orderDetails.status = 'buyer-confirmed';
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOnlyReceivedButton).toBe(true);
        });
    });

    describe('shouldShowOrderTimer', () => {
        it('should return false if order is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOrderTimer).toBe(false);
        });

        it('should return true if status is pending', () => {
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOrderTimer).toBe(true);
        });

        it('should return true if status is buyer-confirmed', () => {
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.shouldShowOrderTimer).toBe(true);
        });
    });

    describe('statusForBuyerConfirmedOrder', () => {
        it('should return confirmMessage if isMyAd is true and isBuyOrder is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForBuyerConfirmedOrder).toBe('Confirm payment');
        });

        it('should return waitMessage if isMyAd is true and isSellOrder is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForBuyerConfirmedOrder).toBe('Waiting for the seller to confirm');
        });

        it('should return waitMessage if isMyAd is false and isBuyOrder is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForBuyerConfirmedOrder).toBe('Waiting for the seller to confirm');
        });

        it('should return confirmMessage if isMyAd is false and isSellOrder is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForBuyerConfirmedOrder).toBe('Confirm payment');
        });
    });

    describe('statusForPendingOrder', () => {
        it('should return waitMessage if isMyAd, isBuyOrder are true', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForPendingOrder).toBe('Wait for payment');
        });

        it('should return payMessage if isMyAd, isSellOrder are true', () => {
            mockData.orderDetails.advertiser_details.loginid = '123';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForPendingOrder).toBe('Pay now');
        });

        it('should return payMessage if isMyAd is false, isBuyOrder is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'buy';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForPendingOrder).toBe('Pay now');
        });

        it('should return waitMessage if isMyAd is false, isSellOrder is true', () => {
            mockData.orderDetails.advertiser_details.loginid = '456';
            mockData.orderDetails.type = 'sell';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusForPendingOrder).toBe('Wait for payment');
        });
    });

    describe('statusString', () => {
        it('should return Unknown if status is undefined', () => {
            // @ts-expect-error - status is set to undefined for testing
            mockData.orderDetails.status = undefined;

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Unknown');
        });

        it('should return Completed if status is completed', () => {
            mockData.orderDetails.status = 'completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Completed');
        });

        it('should return Completed if status is dispute-completed', () => {
            mockData.orderDetails.status = 'dispute-completed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Completed');
        });

        it('should return Cancelled if status is cancelled', () => {
            mockData.orderDetails.status = 'cancelled';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Cancelled');
        });

        it('should return Expired if status is refunded', () => {
            mockData.orderDetails.status = 'refunded';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Expired');
        });

        it('should return Expired if status is dispute-refunded', () => {
            mockData.orderDetails.status = 'dispute-refunded';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Expired');
        });

        it('should return Under dispute if status is disputed', () => {
            mockData.orderDetails.status = 'disputed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Under dispute');
        });

        it('should return Expired if status is timed-out', () => {
            mockData.orderDetails.status = 'timed-out';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Expired');
        });

        it('should return Expired if timer has expired', () => {
            mockData.orderDetails.expiry_time = 1627584000;
            mockData.orderDetails.status = 'blocked';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Expired');
        });

        it('should return Wait for payment if status is pending', () => {
            mockData.orderDetails.expiry_time = 1637584000;
            mockData.orderDetails.status = 'pending';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Wait for payment');
        });

        it('should return Confirm payment if status is buyer-confirmed', () => {
            mockData.orderDetails.status = 'buyer-confirmed';

            const { result } = renderHook(() => useExtendedOrderDetails(mockData));

            expect(result.current.data.statusString).toBe('Confirm payment');
        });
    });
});
