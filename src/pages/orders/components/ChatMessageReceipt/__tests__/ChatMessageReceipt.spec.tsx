import { render, screen } from '@testing-library/react';

import ChatMessageReceipt from '../ChatMessageReceipt';

const mockProps = {
    chatChannel: {
        cachedUnreadMemberState: {
            '123': 123,
        },
    },
    message: {
        createdAt: 123,
        status: 2,
    },
    userId: '123',
};

describe('ChatMessageReceipt', () => {
    it('should render the component as expected with the passed props', () => {
        render(<ChatMessageReceipt {...mockProps} />);
        expect(screen.getByTestId('dt_chat_message_receipt_icon')).toBeInTheDocument();
    });
});
