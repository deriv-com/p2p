import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';

// jest.setup.js
jest.mock('@deriv-com/auth-client', () => ({
    useOAuth2: jest.fn(),
}));

process.env.VITE_TRACKJS_TOKEN = 'test-token';
