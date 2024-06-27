import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvertiserNameToggle from '../AdvertiserNameToggle';

const mockProps = {
    advertiserInfo: {
        fullName: 'Jane Doe',
        shouldShowName: false,
    },
    onToggle: jest.fn(),
};
const mockUseAdvertiserUpdateMutate = jest.fn();

jest.mock('@/hooks', () => ({
    api: {
        advertiser: {
            useUpdate: jest.fn(() => ({
                mutate: mockUseAdvertiserUpdateMutate,
            })),
        },
    },
}));

describe('AdvertiserNameToggle', () => {
    it('should render full name in toggle', () => {
        render(<AdvertiserNameToggle {...mockProps} />);
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
    it('should switch full name settings', async () => {
        render(<AdvertiserNameToggle {...mockProps} />);
        const labelBtn = screen.getByRole('checkbox');
        await userEvent.click(labelBtn);

        expect(mockUseAdvertiserUpdateMutate).toBeCalledWith({
            show_name: 1,
        });
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        await userEvent.click(labelBtn);

        expect(mockUseAdvertiserUpdateMutate).toBeCalledWith({
            show_name: 0,
        });
    });
});
