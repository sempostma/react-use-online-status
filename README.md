# react-use-online-status

React hook which detects native online status changes and supports polling for more accurate network statuses.

## Install 

```bash
npm install --save react-use-online-status
```

## Usage

```javascript
import useOnlineStatus from 'react-use-online-status'

const FunctionalComponent = props => {
    const isOnline = useOnlineStatus()

    return (
        <p>Is online: {isOnline ? 'Yes' : 'No'}</p>
    )
}
```

## Advanced usecase

```javascript
import useOnlineStatus from 'react-use-online-status'

const FunctionalComponent = props => {
    const isOnline = useOnlineStatus('/polling-url' || 'https://google.com/generate_204', { 
        interval: 10 * 1000, /* ten seconds (default) */ 
        timeout: 10 * 1000, /* ten seconds (default) */
        method: 'GET' /* (default)
    })

    return (
        <p>Is online: {isOnline ? 'Yes' : 'No'}</p>
    )
}
```

## License

License: MIT
