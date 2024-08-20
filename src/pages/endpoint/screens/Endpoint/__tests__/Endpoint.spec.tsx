import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Endpoint from '../Endpoint';

describe('<Endpoint />', () => {
    it('should render the endpoint component', () => {
        render(<Endpoint />);

        expect(screen.getByText('Change API endpoint')).toBeInTheDocument();
        expect(screen.getByText('Server')).toBeInTheDocument();
        expect(screen.getByText('OAuth App ID')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset to original settings' })).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        render(<Endpoint />);

        const serverUrlInput = screen.getByTestId('dt_endpoint_server_url_input');
        const appIdInput = screen.getByTestId('dt_endpoint_app_id_input');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await userEvent.type(serverUrlInput, 'qa10.deriv.dev');
        await userEvent.type(appIdInput, '123');
        await userEvent.click(submitButton);

        expect(JSON.parse(localStorage.getItem('config.server_url') || '')).toBe('qa10.deriv.dev');
        expect(JSON.parse(localStorage.getItem('config.app_id') || '')).toBe('123');
    });

    it('should reset the server_url and app_id when user clicks on the reset button', async () => {
        render(<Endpoint />);

        const serverUrlInput = screen.getByTestId('dt_endpoint_server_url_input');
        const appIdInput = screen.getByTestId('dt_endpoint_app_id_input');
        const resetButton = screen.getByRole('button', { name: 'Reset to default' });

        await userEvent.type(serverUrlInput, 'qa10.deriv.dev');
        await userEvent.type(appIdInput, '123');
        await userEvent.click(resetButton);

        expect(JSON.parse(localStorage.getItem('config.server_url') || '')).toBe('');
        expect(JSON.parse(localStorage.getItem('config.app_id') || '')).toBe('');
    });
});
