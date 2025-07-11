import { Chat } from '../chat';

describe('Chat Utility', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).Intercom = jest.fn();
    });

    describe('open method', () => {
        it('should open Intercom widget', async () => {
            Chat.open();

            expect(window.Intercom).toHaveBeenCalledWith('show');
        });

        it('should close Intercom widget', async () => {
            Chat.clear();

            expect(window.Intercom).toHaveBeenCalledWith('shutdown');
        });
    });
});
