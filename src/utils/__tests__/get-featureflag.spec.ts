// eslint-disable-next-line import/no-extraneous-dependencies
import { Analytics } from '@deriv-com/analytics';
import getFeatureFlag from '../get-featureflag';

// Mock the @deriv-com/analytics module
jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        getFeatureValue: jest.fn(),
        getGrowthbookStatus: jest.fn(),
        getInstances: jest.fn(),
    },
}));

describe('getFeatureFlag', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).GrowthbookFeatures = {}; // Type assertion for window
    });

    it('should return cached feature flag value if already defined in window.GrowthbookFeatures', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).GrowthbookFeatures.feature_flag = true;

        const result = await getFeatureFlag('feature_flag');

        expect(result).toBe(true);
        expect(Analytics.getInstances).not.toHaveBeenCalled();
    });

    it('should return feature flag value based on GrowthBook status and feature availability', async () => {
        (Analytics.getInstances as jest.Mock).mockReturnValueOnce({ ab: {} });
        (Analytics.getGrowthbookStatus as jest.Mock).mockResolvedValueOnce({
            isLoaded: true,
            status: { success: true },
        });
        (Analytics.getFeatureValue as jest.Mock).mockReturnValueOnce(true);

        const result = await getFeatureFlag('feature_flag');

        expect(result).toBe(true);
        expect(Analytics.getFeatureValue).toHaveBeenCalledWith('feature_flag', false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((window as any).GrowthbookFeatures.feature_flag).toBe(true);
    });

    it('should return the defaultValue if provided and GrowthBook feature is unavailable', async () => {
        (Analytics.getInstances as jest.Mock).mockReturnValueOnce({ ab: {} });
        (Analytics.getGrowthbookStatus as jest.Mock).mockResolvedValueOnce({
            isLoaded: true,
            status: { success: true },
        });
        (Analytics.getFeatureValue as jest.Mock).mockReturnValueOnce(false);

        const result = await getFeatureFlag('feature_flag', true);

        expect(result).toBe(false);
        expect(Analytics.getFeatureValue).toHaveBeenCalledWith('feature_flag', true);
    });

    it('should return false if GrowthBook config encounters issues', async () => {
        (Analytics.getInstances as jest.Mock).mockReturnValueOnce({ ab: {} });
        (Analytics.getGrowthbookStatus as jest.Mock).mockResolvedValueOnce({
            isLoaded: true,
            status: { success: false },
        });

        const result = await getFeatureFlag('feature_flag');

        expect(result).toBe(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((window as any).GrowthbookFeatures.feature_flag).toBe(false);
    });
});
