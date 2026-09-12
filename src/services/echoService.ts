import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

let echo: Echo<'reverb'> | null = null
let currentToken: string | null = null

function apiOrigin(): string {
    const serverUrl = import.meta.env.VITE_SERVER_URL

    return serverUrl.startsWith('http') ? new URL(serverUrl).origin : ''
}

function envValue(value: string | undefined): string | undefined {
    return value?.trim() || undefined
}

export function getEcho(token: string): Echo<'reverb'> {
    if (echo && currentToken === token) return echo

    echo?.disconnect()
    currentToken = token

    const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http'
    const configuredPort = envValue(import.meta.env.VITE_REVERB_PORT)
    const port = Number(configuredPort ?? window.location.port ?? (scheme === 'https' ? 443 : 80))
    const useTLS = scheme === 'https'

    echo = new Echo<'reverb'>({
        broadcaster: 'reverb',
        Pusher,
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: envValue(import.meta.env.VITE_REVERB_HOST) ?? window.location.hostname,
        wsPort: port,
        wssPort: port,
        forceTLS: useTLS,
        enabledTransports: useTLS ? ['wss'] : ['ws'],
        authEndpoint: `${apiOrigin()}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        },
    })

    return echo
}

export function disconnectEcho(): void {
    echo?.disconnect()
    echo = null
    currentToken = null
}
