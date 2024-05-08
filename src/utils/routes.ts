/**
 * Gets the first segment of the pathname from the URL
 * @returns {string} The first segment of the route
 */
export const getCurrentRoute = (): string | undefined => {
    const segments = new URL(window.location.href).pathname.split('/');
    const firstSegment = segments[1]; // segments[0] will be an empty string because the path starts with '/'
    return firstSegment;
};
