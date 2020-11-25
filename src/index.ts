import { useEffect, useState } from "react";
import memoize from 'lodash/memoize'
import throttle from 'lodash/throttle'

// Rejects the promise after ms
const timeoutAfterMs = (ms: number) => new Promise((_, reject) => setTimeout(reject, ms))

// Returns a stringified version of the arguments meants as key for the memoize function
const keyResolver = (pollingUrl: string, interval: number, timeout: number, method: string) => 
  [pollingUrl, interval, timeout, method].join('_')

// This function actually polls the endpoint
const _pollFunction = (pollingUrl: string, timeout: number, method: string) => {
  return Promise.race([
    fetch(pollingUrl as string, { method, mode: 'no-cors' }),
    timeoutAfterMs(timeout)
  ])
}

// This function returns a throttled version of the polling function
const getPollFunc = (pollingUrl: string, interval: number, timeout: number, method: string) =>
  throttle(() => _pollFunction(pollingUrl, timeout, method), interval, { trailing: true, leading: true })

// This function returns a memoized throttled version from
// If this is called with a different method, timeout, interval or url argument, a new polling function is returned
export const getPoller = memoize(getPollFunc, keyResolver)

const useOnlineStatus = (pollingUrl: false | string = false, { timeout = 10000, interval = 10000, method = 'GET', onPollingError = (error: Error) => {/**/} } = {}) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)

  useEffect(() => {
    const windowOnlineOrOfflineLinstener = () => {
      const nowOnline = window.navigator.onLine
      if (isOnline && !nowOnline) setIsOnline(false)
      else if (!isOnline && nowOnline) setIsOnline(true)
    }

    window.addEventListener('online', windowOnlineOrOfflineLinstener)
    window.addEventListener('offline', windowOnlineOrOfflineLinstener)

    const poller = getPoller(pollingUrl as string, interval, timeout, method)

    const poll = async () => {
      try {
        await poller()
      } catch(err) {
        if (onPollingError) onPollingError(err)
        setIsOnline(false)
      }
    }

    const handle = pollingUrl && setInterval(poll, interval)

    return () => {
      window.removeEventListener('online', windowOnlineOrOfflineLinstener)
      window.removeEventListener('offline', windowOnlineOrOfflineLinstener)
      if (handle) clearInterval(handle)
    }

  }, [pollingUrl, timeout, interval, method])

  return isOnline
}

export default useOnlineStatus
