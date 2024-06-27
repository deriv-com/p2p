import { FC, PropsWithChildren } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { act, renderHook } from '@testing-library/react';
import useModalManager from '../useModalManager';
import useQueryString from '../useQueryString';

const mockReplace = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        replace: mockReplace,
    }),
}));

const mockedUseQueryString = useQueryString as jest.MockedFunction<typeof useQueryString>;
jest.mock('@/hooks/custom-hooks/useQueryString', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        deleteQueryString: jest.fn(),
        queryString: {},
        setQueryString: jest.fn(),
    })),
}));

const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;
jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockImplementation(() => ({
        isMobile: false,
    })),
}));

let windowLocationSpy: jest.SpyInstance<Location, []>;
const mockQueryString = {
    advertId: undefined,
    formAction: undefined,
    modal: undefined,
    paymentMethodId: undefined,
    tab: undefined,
};

describe('useModalManager', () => {
    beforeEach(() => {
        windowLocationSpy = jest.spyOn(window, 'location', 'get');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should render and show the correct modal states when showModal is called', async () => {
        const originalLocation = window.location;
        const history = createMemoryHistory();
        const wrapper: FC<PropsWithChildren> = ({ children }) => {
            return <Router history={history}>{children}</Router>;
        };

        const { rerender, result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        act(() => {
            result.current.showModal('ModalA');
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA',
            search: '?modal=ModalA',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                advertId: undefined,
                formAction: undefined,
                modal: 'ModalA',
                paymentMethodId: undefined,
                tab: undefined,
            },
            setQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.showModal('ModalB');
        });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(true);

        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB',
            search: '?modal=ModalA,ModalB',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA,ModalB',
            },
            setQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.showModal('ModalC');
        });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
    });
    it('should hide the modals and show previous modal when current modal hidden', () => {
        const history = createMemoryHistory();
        const wrapper: FC<PropsWithChildren> = ({ children }) => {
            return <Router history={history}>{children}</Router>;
        };

        const { rerender, result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        act(() => {
            result.current.showModal('ModalA');
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA',
            search: '?modal=ModalA',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA',
            },
            setQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.showModal('ModalB');
        });

        windowLocationSpy.mockImplementation(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB',
            search: '?modal=ModalA,ModalB',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA,ModalB',
            },
            setQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.hideModal();
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);

        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA',
            search: '?modal=ModalA',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA',
            },
            setQueryString: jest.fn(),
        }));
        rerender();

        act(() => {
            result.current.hideModal();
        });
        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
    });
    it('should show the modals when URL is initialized with default modal states', () => {
        const history = createMemoryHistory();
        const wrapper: FC<PropsWithChildren> = ({ children }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA,ModalB,ModalC',
            },
            setQueryString: jest.fn(),
        }));

        const { result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
    });
    it('should should not show the modals on navigated back when shouldReinitializeModals is set to false', () => {
        const history = createMemoryHistory();
        const wrapper: FC<PropsWithChildren> = ({ children }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA,ModalB,ModalC',
            },
            setQueryString: jest.fn(),
        }));

        const { result } = renderHook(
            () =>
                useModalManager({
                    shouldReinitializeModals: false,
                }),
            { wrapper }
        );

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(false);
    });
    it('should should show the modals on navigated back when shouldReinitializeModals is set to true', () => {
        const history = createMemoryHistory();
        const wrapper: FC<PropsWithChildren> = ({ children }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA,ModalB,ModalC',
            },
            setQueryString: jest.fn(),
        }));

        const { result } = renderHook(
            () =>
                useModalManager({
                    shouldReinitializeModals: true,
                }),
            { wrapper }
        );

        expect(result.current.isModalOpenFor('ModalA')).toBe(false);
        expect(result.current.isModalOpenFor('ModalB')).toBe(false);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
    });
    it('should should stack the modals in mobile', () => {
        const history = createMemoryHistory();
        const wrapper: FC<PropsWithChildren> = ({ children }) => {
            return <Router history={history}>{children}</Router>;
        };

        const originalLocation = window.location;
        windowLocationSpy.mockImplementationOnce(() => ({
            ...originalLocation,
            href: 'http://localhost?modal=ModalA,ModalB,ModalC',
            search: '?modal=ModalA,ModalB,ModalC',
        }));
        (mockedUseDevice as jest.Mock).mockImplementation(() => ({
            isDesktop: false,
            isMobile: true,
            isTablet: false,
            isTabletPortrait: false,
        }));
        mockedUseQueryString.mockImplementationOnce(() => ({
            deleteQueryString: jest.fn(),
            queryString: {
                ...mockQueryString,
                modal: 'ModalA,ModalB,ModalC',
            },
            setQueryString: jest.fn(),
        }));

        const { result } = renderHook(() => useModalManager(), { wrapper });

        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(true);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);

        act(() => {
            result.current.showModal('ModalD');
        });

        expect(result.current.isModalOpenFor('ModalA')).toBe(true);
        expect(result.current.isModalOpenFor('ModalB')).toBe(true);
        expect(result.current.isModalOpenFor('ModalC')).toBe(true);
        expect(result.current.isModalOpenFor('ModalD')).toBe(true);
    });
});
