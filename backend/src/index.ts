import { WebSocket } from 'ws';
import { Game } from './game';

const game = new Game();

const users = {} as Record<string, User>;

game.on('oneChoice', (chooser) => {
	const enemyId = Object.keys(users).filter(
		(user) => Number(user) !== Number(chooser)
	)[0];
	users[enemyId].text = 'Противник сделал ход';
	users[chooser].text = 'Ожидайте хода противника';

	broadcastMessage({
		type: 'game',
		users,
	});
	users[enemyId].text = '';
	users[chooser].text = '';
});
game.on('draw', () => {
	Object.keys(users).forEach((user) => (users[user].text = 'Ничья'));
	broadcastMessage({
		type: 'round',
		users,
	});
	Object.keys(users).forEach((user) => (users[user].text = ''));
});
game.on('winner', (winnerId) => {
	users[winnerId].score = users[winnerId].score + 1;
	users[winnerId].text = 'Победа';
});
game.on('loser', (loserId) => {
	users[loserId].text = 'Проигрыш';
});
game.on('end', () => {
	broadcastMessage({ type: 'round', users });
	Object.keys(users).forEach((user) => (users[user].text = ''));
});

interface Message {
	event: string;
	message: string;
	username: string;
	id: number;
}

interface User {
	id: number;
	username: string;
	score: number;
	text?: string;
}

const wss = new WebSocket.Server(
	{
		port: 5000,
	},
	() => console.log(`Server started on 5000`)
);

wss.on('connection', (ws) => {
	ws.on('message', (mes) => {
		const message = JSON.parse(mes.toString()) as Message;
		if (message.event === 'connection') {
			if (Object.keys(users).length >= 2) {
				ws.send(
					JSON.stringify({
						type: 'error',
						reason: 'Уже есть 2 игрока',
					})
				);
				return;
			}

			users[message.id] = {
				id: message.id,
				username: message.username,
				score: 0,
			};
			broadcastMessage({ type: 'connection', users });
			return;
		}

		if (message.event === 'game') {
			game.run(message.id, message.message);
		}
	});
});

function broadcastMessage(message: Record<string, any>) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
}
