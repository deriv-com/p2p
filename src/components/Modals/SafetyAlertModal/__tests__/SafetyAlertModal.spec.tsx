import moment from 'moment';
import { fireEvent, render, screen } from '@testing-library/react';
import SafetyAlertModal from '../SafetyAlertModal';

jest.mock('@/hooks', () => ({
    api: {
        account: {
            useActiveAccount: jest.fn(() => ({
                data: {
                    loginid: '123456',
                },
            })),
        },
    },
}));

describe('SafetyAlertModal', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('should render the modal if the timestamp is not set', () => {
        render(<SafetyAlertModal />);
        expect(screen.getByText('Stay safe from phishing scams')).toBeInTheDocument();
        expect(screen.getByText('Deriv will NEVER ask for your login details.')).toBeInTheDocument();
        expect(screen.getByText('Protect your account:')).toBeInTheDocument();
        expect(screen.getByText('Never share verification codes or their screenshots.')).toBeInTheDocument();
        expect(screen.getByText('Always check the website URL.')).toBeInTheDocument();
        expect(screen.getByText('Only communicate with Deriv through live chat.')).toBeInTheDocument();
        expect(screen.getByText('If you spot anything suspicious, let us know via live chat.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should not render the modal if the timestamp is set', () => {
        localStorage.setItem('p2p_123456_disclaimer_shown', moment().valueOf().toString());
        render(<SafetyAlertModal />);
        expect(screen.queryByText('Stay safe from phishing scams')).not.toBeInTheDocument();
    });

    it('should hide the modal when clicking the OK button', () => {
        render(<SafetyAlertModal />);
        const okButton = screen.getByRole('button', { name: 'OK' });
        fireEvent.click(okButton);
        expect(screen.queryByText('Stay safe from phishing scams')).not.toBeInTheDocument();
    });

    it('should remove the timestamp from localStorage once the timestamp is passed one day', () => {
        localStorage.setItem('p2p_123456_disclaimer_shown', moment().subtract(1, 'day').valueOf().toString());
        render(<SafetyAlertModal />);
        expect(screen.queryByText('Stay safe from phishing scams')).not.toBeInTheDocument();
    });
});
