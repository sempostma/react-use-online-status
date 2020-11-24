import * as React from 'react';
import useOnlineStatus from '../src/index'
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react'

const App = () => {
    const onlineStatus = useOnlineStatus()

    return (
        <p>Is online: {onlineStatus ? 'Yes' : 'No'}</p>
    )
}

const AppWithPolling = () => {
    const onlineStatus = useOnlineStatus('https://google.com/generate_204')

    return (
        <p>Is online: {onlineStatus ? 'Yes' : 'No'}</p>
    )
}

describe('run common tests', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

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
});