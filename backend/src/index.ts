import { game, gamers } from './main';
import { sendError } from './helpers';
import { Message } from './types';
import { broadcastMessage, wss } from './server';

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
