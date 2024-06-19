import { StoreApi } from 'zustand';
import { api } from '@/hooks';
import { useStore } from '@/store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NicknameModal from '../NicknameModal';

const mockedMutate = jest.fn();
const mockedReset = jest.fn();
const mockedUseAdvertiserCreate = api.advertiser.useCreate as jest.MockedFunction<typeof api.advertiser.useCreate>;
const mockPush = jest.fn();

jest.mock('lodash', () => ({
    ...jest.requireActual('lodash'),
    debounce: jest.fn(f => f),
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

const mockStore = {
    setHasCreatedAdvertiser: jest.fn(),
};

jest.mock('@/store/useStore');

type TMockStore = {
    setHasCreatedAdvertiser: (value: boolean) => void;
};

const mockedUseStore = useStore as unknown as jest.Mock<StoreApi<TMockStore>>;

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

const user = userEvent.setup({ delay: null });

describe('NicknameModal', () => {
    beforeEach(() => {
        mockedUseStore.mockImplementation(selector => selector(mockStore));
    });
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
        expect(mockStore.setHasCreatedAdvertiser).toHaveBeenCalledWith(true);
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
