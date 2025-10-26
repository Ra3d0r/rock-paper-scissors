const WS_PORT = import.meta.env.WS_PORT;
const isDev = import.meta.env.DEV;

// В dev используем localhost напрямую, в prod через nginx reverse proxy
export const WS_URL = isDev ? `ws://localhost:${WS_PORT}` : `ws://${window.location.host}/ws`;
