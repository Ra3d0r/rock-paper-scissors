import { WebSocket } from 'ws';
import { ENV } from './config';

const PORT = parseInt(ENV.BACKEND_PORT);

export const wss = new WebSocket.Server(
	{
		port: PORT,
		path: '/ws',
	},
	() => console.log(`Server started on ${wss.options.port}`),
);

export function broadcastMessage(message: Record<string, unknown>) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
}
