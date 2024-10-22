import { WebSocket } from 'ws';
import { Game } from './game';
import { Users } from './users';

const game = new Game();

const gamers = new Users();

game.on('oneChoice', (chooser) => {
	const users = gamers.choice(chooser);
	broadcastMessage({
		type: 'game',
		users,
	});
	gamers.clearText();
});

game.on('draw', () => {
	const users = gamers.setAllText('Ничья');
	broadcastMessage({
		type: 'round',
		users,
	});
	gamers.clearText();
});

game.on('winner', (winnerId) => {
	gamers.win(winnerId);
});

game.on('loser', (loserId) => {
	gamers.lose(loserId);
});

game.on('end', () => {
	const users = gamers.getUsers();
	broadcastMessage({ type: 'round', users });
	gamers.clearText();
});

interface Message {
	event: string;
	message: string;
	username: string;
	id: number;
}

const wss = new WebSocket.Server(
	{
		port: 5000,
	},
	() => console.log(`Server started on 5000`),
);

wss.on('connection', (ws) => {
	let currentId = 0;

	ws.on('message', (mes) => {
		const message = JSON.parse(mes.toString()) as Message;

		if (message.event === 'connection') {
			currentId = message.id;
			gamers
				.add({ id: message.id, username: message.username })
				.catch((reason) => ws.send(sendError(reason)))
				.then((users) => broadcastMessage({ type: 'connection', users }));
			return;
		}

		if (message.event === 'game') {
			const users = gamers.getUsers();
			if (Object.keys(users).length <= 1) {
				ws.send(sendError('Нет второго игрока'));
				return;
			}
			game.run(message.id, message.message);
		}
	});

	ws.on('close', () => {
		game.removeGamer(currentId);
		gamers.removeUser(currentId);
		gamers.resetAllScore();
		game.resetAllChoice();

		const users = gamers.setAllText('Противник вышел');
		broadcastMessage({
			type: 'end',
			users,
		});

		gamers.clearText();
	});
});

function broadcastMessage(message: Record<string, any>) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
}

function sendError(reason: string) {
	return JSON.stringify({ type: 'error', reason });
}
