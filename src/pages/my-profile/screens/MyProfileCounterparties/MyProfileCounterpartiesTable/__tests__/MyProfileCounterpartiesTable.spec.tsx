import { api } from '@/hooks';
import { render, screen, waitFor } from '@testing-library/react';
import MyProfileCounterpartiesTable from '../MyProfileCounterpartiesTable';

const mockProps = {
    dropdownValue: 'all',
    searchValue: '',
    setShowHeader: jest.fn(),
};

const mockApiValues = {
    data: [],
    isFetching: false,
    isLoading: false,
    loadMoreAdvertisers: jest.fn(),
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@/hooks', () => ({
    api: {
        advertiser: {
            useGetList: jest.fn(() => mockApiValues),
        },
    },
}));

const mockUseModalManager = {
    hideModal: jest.fn(),
    isModalOpenFor: jest.fn(),
    showModal: jest.fn(),
};

jest.mock('@/hooks/custom-hooks', () => ({
    useIsAdvertiserBarred: jest.fn(() => false),
    useModalManager: jest.fn(() => mockUseModalManager),
}));

jest.mock('@/components/Modals/BlockUnblockUserModal', () => ({
    BlockUnblockUserModal: () => <div>BlockUnblockUserModal</div>,
}));

const mockUseGetList = api.advertiser.useGetList as jest.Mock;
describe('MyProfileCounterpartiesTable', () => {
    it('should render the empty results when there is no data', () => {
        render(<MyProfileCounterpartiesTable {...mockProps} />);
        expect(screen.getByText('No one to show here')).toBeInTheDocument();
    });
    it('should render Loader when isLoading is true', () => {
        mockUseGetList.mockReturnValue({
            ...mockApiValues,
            isLoading: true,
        });
        render(<MyProfileCounterpartiesTable {...mockProps} />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
    it('should show header when data is present', async () => {
        mockUseGetList.mockReturnValue({
            ...mockApiValues,
            data: [{ id: 'id1', is_blocked: false, name: 'name1' }],
        });
        render(<MyProfileCounterpartiesTable {...mockProps} />);

        await waitFor(() => {
            expect(mockProps.setShowHeader).toHaveBeenCalledWith(true);
        });
    });
    it('should show the corresponding message when search value is provided and no matching name is found', () => {
        mockUseGetList.mockReturnValue({
            ...mockApiValues,
            data: [],
        });
        const newProps = {
            ...mockProps,
            searchValue: 'test',
        };
        render(<MyProfileCounterpartiesTable {...newProps} />);
        expect(screen.getByText('There are no matching name.')).toBeInTheDocument();
    });
});
