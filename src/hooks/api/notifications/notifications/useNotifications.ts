import { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { useSubscribe, useMutation } from '@deriv-com/api-hooks';

// handles streamed updates to notifications
const handleData = (incomingMessage: any, prevMessages: any) : any => { 
    if (!incomingMessage) {
      return prevMessages;
    }

    // iterate over every updated message in the response
    for (let updateIdx = 0; updateIdx < incomingMessage.length; updateIdx++) {
      const update = incomingMessage[updateIdx];

      // find the existing message in the list of messages
      // we should optimise it by using a map instead of an array, but good enough for now, 
      const existingMessageIndex = prevMessages.findIndex((message: any) => message.id === update.id);
      const existingMessage = prevMessages[existingMessageIndex];

      // remove if update marks is as removed
      if (existingMessage && update.removed) {
        prevMessages = prevMessages.filter((message: any) => message.id !== update.id);
        continue;
      }

      // update the message if it exists
      if (existingMessage) {
        prevMessages[existingMessageIndex] = Object.assign({}, existingMessage, update);
        continue;
      }

      // TODO: support the case when message is being udpated, but its below the current last id, 
      prevMessages.unshift(update); 
    }

    prevMessages.sort((a: any, b: any) => b.id - a.id);
    return [...prevMessages];
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
    // @ts-ignore
    const { mutate, } = useMutation({ name: 'notifications_update_status' });

    // @ts-ignore
    const { mutateAsync } = useMutation({ name: 'notifications_list' });

    const loadMore = useCallback(async () => {
      const response = await mutateAsync({
        //@ts-ignore
        starts_from: messages[messages.length - 1].id,
        size: 10,
      });

      // @ts-ignore
      handleData(response.notifications_list.messages, messages);
    }, [mutateAsync, messages]);

    useEffect(() => {
        subscribe({
            subscribe: 1,
        });
        return () => {
            unsubscribe();
        };
    }, [subscribe, unsubscribe]);

    useEffect(() => {
      // @ts-ignore
      if (data?.notifications_list) {
          setMessages(prevMessages => {
              // @ts-ignore
              return handleData(data.notifications_list.messages, prevMessages);
          });

          // @ts-ignore  
          const unread_count = data.notifications_list.count_unread;
          setUnreadCount(unread_count);
      }
    }, [data]);


    const removeAll = useCallback(() => {
        // remove all requires sending and empty array of ids ¯\_(ツ)_/¯
        mutate({notifications_update_status: 'remove', ids: [] });
    }, [mutate]);

    return {
        messages,
        unreadCount,
        removeAll,
        loadMore,
    };
};

export default useNotifications;
