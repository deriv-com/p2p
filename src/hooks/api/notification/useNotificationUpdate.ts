/**
 * Hook that updates the status of a notification. The notification can be removed or marked as read or unread.
 *
 */
const useNotificationUpdate = () => {
    const readAllNotifications = async () => {
        try {
            await fetch('https://fs191x.buildship.run/v4/notification/read', {
                body: JSON.stringify({
                    authorize: localStorage.getItem('authToken'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };
    return {
        readAllNotifications,
    };
};

export default useNotificationUpdate;
