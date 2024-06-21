import { BrowserRouter } from 'react-router-dom';
import { ENDPOINT } from '@/constants';
import { LocalStorageConstants, LocalStorageUtils } from '@deriv-com/utils';
import { render, screen } from '@testing-library/react';
import Endpoint from '../Endpoint';

jest.mock('@deriv-com/utils', () => ({
    ...jest.requireActual('@deriv-com/utils'),
    LocalStorageUtils: {
        ...jest.requireActual('@deriv-com/utils').LocalStorageUtils,
        getValue: jest.fn(),
    },
}));

const mockGetValue = LocalStorageUtils.getValue as jest.Mock;

describe('Endpoint component', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        mockGetValue.mockReset();
    });

    it('renders correctly when server URL is set in localStorage', () => {
        const serverURL = 'https://example.com';
        mockGetValue.mockImplementation(key => {
            if (key === LocalStorageConstants.configServerURL) {
                return serverURL;
            }
            return null;
        });

        render(
            <BrowserRouter>
                <Endpoint />
            </BrowserRouter>
        );

        const linkElement = screen.getByRole('link', { name: 'endpoint' });
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', ENDPOINT);
    });

    it('does not render when server URL is not set in localStorage', () => {
        render(
            <BrowserRouter>
                <Endpoint />
            </BrowserRouter>
        );

        expect(screen.queryByText(/The server endpoint is:/)).not.toBeInTheDocument();
    });
});
