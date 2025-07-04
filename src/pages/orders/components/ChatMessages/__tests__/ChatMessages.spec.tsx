import { TFileType } from 'types';
import { render, screen } from '@testing-library/react';
import { TChatMessageReceiptProps } from '../../ChatMessageReceipt/ChatMessageReceipt';
import ChatMessages from '../ChatMessages';

const mockProps = {
    chatChannel: {
        cachedUnreadMemberState: {
            '123': 123,
        },
    } as TChatMessageReceiptProps['chatChannel'],
    chatMessages: [
        {
            channelUrl: 'url123',
            createdAt: 12345677,
            customType: '',
            id: 'id1',
            message: 'this is the message',
            messageType: 'user',
            name: 'name',
            senderUserId: '123',
            size: 1024,
            status: 0,
            url: '',
        },
    ],
    userId: '123',
};

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({ isMobile: false }),
}));

describe('ChatMessages', () => {
    it('should render the messages as expected', () => {
        render(<ChatMessages {...mockProps} />);
        expect(
            screen.getByText(/Deriv will never contact you via WhatsApp or ask for login info or codes./)
        ).toBeInTheDocument();
    });
    it('should display the message sent by the user', () => {
        render(<ChatMessages {...mockProps} />);
        expect(screen.getByText('this is the message')).toBeInTheDocument();
    });
    it('should render the image', () => {
        const props = {
            ...mockProps,
            chatMessages: [
                {
                    ...mockProps.chatMessages[0],
                    fileType: 'image' as TFileType,
                    messageType: 'file',
                    name: 'sample image',
                    url: 'url',
                },
            ],
        };
        render(<ChatMessages {...props} />);
        expect(screen.getByAltText('sample image')).toBeInTheDocument();
    });
    it('should show the pdf icon for sending pdf file', () => {
        const props = {
            ...mockProps,
            chatMessages: [
                {
                    ...mockProps.chatMessages[0],
                    fileType: 'pdf' as TFileType,
                    messageType: 'file',
                    name: 'sample.pdf',
                    size: 1024,
                    url: 'url',
                },
            ],
        };
        render(<ChatMessages {...props} />);
        expect(screen.getByText('sample.pdf')).toBeInTheDocument();
    });
});
