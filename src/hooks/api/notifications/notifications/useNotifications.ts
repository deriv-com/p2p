import { useEffect } from 'react';
import { useState } from 'react';
import { useSubscribe } from '@deriv-com/api-hooks';



const handleUpdate = (update: any, messages: any) : any => { 
    console.log('>>> update', update);
    if (!update) {
      return messages; 
    }
    
    const updatedMessages = update.notifications_list?.messages;

    if (!updatedMessages) {
      return messages;
    }
    
    // iterate over
    updatedMessages.forEach((updatedMessage: any) => {
      const existingMessage = messages.find((message: any) => message.id === updatedMessage.id);
      if (existingMessage) {

        // TODO: backend should only send us either the whole object, full and complete
        // or only the fields that have changed, 
        // righ now backend sends us seemingly whole object, but with some fields empty, some fields containing empty arrays,
        // so no way to tell whats really going on
        Object.keys(updatedMessage).forEach((key) => {
          if (updatedMessage[key] === "" || (Array.isArray(updatedMessage[key]) && updatedMessage[key].length === 0)) {
            delete updatedMessage[key];
          }
        });

        if (updatedMessage.removed) {
          // in such case, delete notification of given id from prevResponse.notifications_list.messages
          messages = messages.filter((message: any) => message.id !== updatedMessage.id);
        } else {
          Object.assign(existingMessage, updatedMessage);
        }
      } else {
        messages.unshift(updatedMessage);
      }
    });

    return [...messages];
}

/**
 * A custom hook to create a p2p chat for the specified order.
 *
 * @example
 * const { data, mutate } = useChatCreate();
 * mutate({ order_id: 'order_id' });
 * **/
const useNotifications = () => {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // @ts-ignore
    const { subscribe, unsubscribe, data } = useSubscribe('notifications_list');

    useEffect(() => {
        subscribe({
            subscribe: 1,
        });
        return () => {
            unsubscribe();
        };
    }, [subscribe, unsubscribe]);

    useEffect(() => {
        const newMessages = handleUpdate(data, messages);
        // @ts-ignore
        const unread_count = data?.notifications_list?.unread_count; 

        setMessages(newMessages);
        setUnreadCount(unread_count);
    }, [data]);

    return {
        messages,
        unreadCount,
    
    };
};

export default useNotifications;
