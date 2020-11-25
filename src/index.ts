import { useEffect, useState } from "react";

const timeoutAfterMs = (ms: number) => new Promise((_, reject) => setTimeout(reject, ms))

const useOnlineStatus = (pollingUrl: false | string = false, { timeout = 10000, interval = 10000, method = 'GET', onPollingError = (error: Error) => {/**/} } = { }) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)

  useEffect(() => {
    const windowOnlineOrOfflineLinstener = () => {
      const nowOnline = window.navigator.onLine
      if (isOnline && !nowOnline) setIsOnline(false)
      else if (!isOnline && nowOnline) setIsOnline(true)
    }

    window.addEventListener('online', windowOnlineOrOfflineLinstener)
    window.addEventListener('offline', windowOnlineOrOfflineLinstener)

    const poll = async () => {
      try {
        await Promise.race([
          fetch(pollingUrl as string, { method }),
          timeoutAfterMs(timeout)
        ])
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
