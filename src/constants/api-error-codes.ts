export const ERROR_CODES = {
    ACCOUNT_DISABLED: 'AccountDisabled',
    AD_EXCEEDS_BALANCE: 'advertiser_balance',
    AD_EXCEEDS_DAILY_LIMIT: 'advertiser_daily_limit',
    ADVERT_INACTIVE: 'advert_inactive',
    ADVERT_MAX_LIMIT: 'advert_max_limit',
    ADVERT_MIN_LIMIT: 'advert_min_limit',
    ADVERT_REMAINING: 'advert_remaining',
    ADVERT_SAME_LIMITS: 'AdvertSameLimits',
    ADVERTISER_ADS_PAUSED: 'advertiser_ads_paused',
    ADVERTISER_NOT_FOUND: 'AdvertiserNotFound',
    ADVERTISER_NOT_REGISTERED: 'AdvertiserNotRegistered',
    ADVERTISER_SCHEDULE: 'advertiser_schedule',
    ADVERTISER_SCHEDULE_AVAILABILITY: 'AdvertiserScheduleAvailability',
    ADVERTISER_TEMP_BAN: 'advertiser_temp_ban',
    CLIENT_SCHEDULE_AVAILABILITY: 'ClientScheduleAvailability',
    DUPLICATE_ADVERT: 'DuplicateAdvert',
    EXCESSIVE_VERIFICATION_FAILURES: 'ExcessiveVerificationFailures',
    EXCESSIVE_VERIFICATION_REQUESTS: 'ExcessiveVerificationRequests',
    INVALID_ADVERTISER_ID: 'InvalidAdvertiserID',
    INVALID_VERIFICATION_TOKEN: 'InvalidVerificationToken',
    ORDER_CONFIRM_COMPLETED: 'OrderConfirmCompleted',
    ORDER_CREATE_FAIL_RATE_SLIPPAGE: 'OrderCreateFailRateSlippage',
    ORDER_EMAIL_VERIFICATION_REQUIRED: 'OrderEmailVerificationRequired',
    PERMISSION_DENIED: 'PermissionDenied',
    TEMPORARY_BAR: 'TemporaryBar',
} as const;
