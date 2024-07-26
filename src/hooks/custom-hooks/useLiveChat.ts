import Cookies from 'js-cookie';
import { useAuthData } from '@deriv-com/api-hooks';

/**
 * Custom hook to initialize LiveChat.
 * @returns {object} LiveChatWidget - LiveChat widget.
 */
const useLiveChat = () => {
    const { activeLoginid } = useAuthData();

    const initLiveChat = () => {
        window.LiveChatWidget.init();
        window.LiveChatWidget.on('ready', () => {
            const clientInformation = JSON.parse(Cookies.get('client_information') ?? '{}');
            const {
                currency = ' ',
                email = ' ',
                firstName = '',
                landingCompanyShortcode = ' ',
                lastName = '',
                loginid = ' ',
                residence = ' ',
            } = clientInformation;
            const sessionVariables = {
                currency,
                email,
                is_logged_in: !!activeLoginid,
                landingCompanyShortcode,
                loginid,
                residence,
            };

            window.LiveChatWidget.call('set_session_variables', sessionVariables);
            window.LiveChatWidget.call('set_customer_email', email);
            window.LiveChatWidget.call('set_customer_name', `${firstName} ${lastName}`);

            window.LC_API.on_chat_ended = () => {
                window.LiveChatWidget?.call('set_customer_email', email);
                window.LiveChatWidget?.call('set_customer_name', `${firstName} ${lastName}`);
            };
        });
    };

    return {
        init: initLiveChat,
        LiveChatWidget: window.LiveChatWidget,
    };
};

export default useLiveChat;
