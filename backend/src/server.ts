import { WebSocket } from 'ws';
import { ENV } from './config';

const PORT = parseInt(ENV.PORT) || 5000;
const HOST = ENV.HOST || '127.0.0.1';

export const wss = new WebSocket.Server(
	{
		port: PORT,
		host: HOST,
	},
	() => console.log(`Server started on ${wss.options.host}:${wss.options.port}`),
);

export function broadcastMessage(message: Record<string, any>) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
}
