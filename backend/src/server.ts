import { WebSocket } from 'ws';

export const wss = new WebSocket.Server(
	{
		port: 5000,
	},
	() => console.log(`Server started on 5000`),
);

export function broadcastMessage(message: Record<string, any>) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
}
