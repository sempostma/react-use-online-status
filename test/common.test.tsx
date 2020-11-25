import * as React from 'react';
import useOnlineStatus from '../src/index'
import { render, fireEvent } from '@testing-library/react'
import fetchMock from 'fetch-mock';
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";

const App = () => {
    const onlineStatus = useOnlineStatus()

    return (
        <p>Is online: {onlineStatus ? 'Yes' : 'No'}</p>
    )
}

describe('run common tests', () => {
    afterEach(() => {
        global.fetch = fetch;
    });

    beforeAll(() => {
        jest.restoreAllMocks();
        jest.clearAllTimers()
        fetchMock.restore();
    })

    it('returns the appropriate network status', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
        const onlineApp = render(<App />)
        expect(onlineApp.container.textContent).toEqual('Is online: Yes');
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
        act(() => {
            fireEvent(window, new Event('offline'))
        })
        expect(onlineApp.container.textContent).toEqual('Is online: No')
    });

    it('returns the appropriate network status', async () => {
        const url = 'https://google.com/generate_204'
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
        fetchMock.mock(url, 500);
        const { result } = renderHook(() => useOnlineStatus(url));
        expect(result.current).toEqual(true);
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
        await act(async () => {
            jest.runOnlyPendingTimers()
            jest.runOnlyPendingTimers()
            jest.clearAllTimers()
        })
        expect(result.current).toEqual(false)
    });
});