export const setupWindowMocks = () => {
    Object.defineProperty(window, 'ResizeObserver', {
        value: jest.fn().mockImplementation(() => ({
            disconnect: jest.fn(),
            observe: jest.fn(),
            unobserve: jest.fn(),
        })),
        writable: true,
    });

    Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation((query: string) => ({
            addEventListener: jest.fn(),
            matches: matchingMediaQueries.includes(query),
            removeEventListener: jest.fn(),
        })),
        writable: true,
    });

    let matchingMediaQueries: string[] = [];

    Object.defineProperty(window, 'IntersectionObserver', {
        value: jest.fn().mockImplementation(() => ({
            disconnect: jest.fn(),
            observe: jest.fn(),
            unobserve: jest.fn(),
        })),
        writable: true,
    });
};
