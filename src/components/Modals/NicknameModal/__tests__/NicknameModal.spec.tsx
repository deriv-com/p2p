import { api } from '@/hooks';
import { useAdvertiserInfoState } from '@/providers/AdvertiserInfoStateProvider';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NicknameModal from '../NicknameModal';

const mockedMutate = jest.fn();
const mockedReset = jest.fn();
const mockedUseAdvertiserCreate = api.advertiser.useCreate as jest.MockedFunction<typeof api.advertiser.useCreate>;
const mockPush = jest.fn();
const mockUseAdvertiserInfoState = useAdvertiserInfoState as jest.MockedFunction<typeof useAdvertiserInfoState>;

jest.mock('lodash/debounce', () => ({
    ...jest.requireActual('lodash/debounce'),
    __esModule: true,
    default: jest.fn(f => f),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: mockPush,
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({
        isMobile: false,
    }),
}));

jest.mock('@/hooks', () => ({
    ...jest.requireActual('@/hooks'),
    api: {
        advertiser: {
            useCreate: jest.fn(() => ({
                error: undefined,
                isError: false,
                isSuccess: true,
                mutate: mockedMutate,
                reset: mockedReset,
            })),
        },
    },
}));

jest.mock('@/providers/AdvertiserInfoStateProvider', () => ({
    useAdvertiserInfoState: jest.fn().mockReturnValue({
        setHasCreatedAdvertiser: jest.fn(),
    }),
}));

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

const user = userEvent.setup({ delay: null });

describe('NicknameModal', () => {
    it('should render title and description correctly', () => {
        render(<NicknameModal {...mockProps} />);
        expect(screen.getByText('What’s your nickname?')).toBeVisible();
        expect(screen.getByText('Others will see this on your profile, ads and charts.')).toBeVisible();
    });
    it('should allow users to type and submit nickname', async () => {
        render(<NicknameModal {...mockProps} />);

        const nicknameInput = screen.getByTestId('dt_nickname_modal_input');

        await user.type(nicknameInput, 'Nahida');

        const confirmBtn = screen.getByRole('button', {
            name: 'Confirm',
        });
        await user.click(confirmBtn);

        expect(mockedMutate).toHaveBeenCalledWith({
            name: 'Nahida',
        });
        expect(mockUseAdvertiserInfoState().setHasCreatedAdvertiser).toHaveBeenCalledWith(true);
    });
    it('should invoke reset when there is an error from creating advertiser', async () => {
        (mockedUseAdvertiserCreate as jest.Mock).mockImplementationOnce(() => ({
            error: undefined,
            isError: true,
            isSuccess: false,
            mutate: mockedMutate,
            reset: mockedReset,
        }));

        render(<NicknameModal {...mockProps} />);

        expect(mockedReset).toHaveBeenCalled();
    });
    it('should close the modal when Cancel button is clicked', async () => {
        (mockedUseAdvertiserCreate as jest.Mock).mockImplementationOnce(() => ({
            error: undefined,
            isError: false,
            isSuccess: true,
            mutate: mockedMutate,
            reset: mockedReset,
        }));

        render(<NicknameModal {...mockProps} />);

        const cancelBtn = screen.getByRole('button', {
            name: 'Cancel',
        });
        await user.click(cancelBtn);

        expect(mockPush).toHaveBeenCalledWith('/buy-sell');
        expect(mockProps.onRequestClose).toHaveBeenCalled();
    });
});
