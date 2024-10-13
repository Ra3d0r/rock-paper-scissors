import { WebSocket } from 'ws';

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

const users = {} as Record<string, User>;

let game: Record<string, string> = {};

function getWinner(data: Record<string, string>): string | null {
	const choices = Object.values(data);

	if (choices.length !== 2) {
		throw new Error('Неправильное количество игроков');
	}

	const [player1Choice, player2Choice] = choices;

	if (player1Choice === player2Choice) {
		return null; // Ничья
	} else if (
		(player1Choice === 'камень' && player2Choice === 'ножницы') ||
		(player1Choice === 'ножницы' && player2Choice === 'бумага') ||
		(player1Choice === 'бумага' && player2Choice === 'камень')
	) {
		return Object.keys(data)[0]; // ID первого игрока
	} else {
		return Object.keys(data)[1]; // ID второго игрока
	}
}

const getEnemy = (usersId: Record<string, string>, id: string) =>
	Object.keys(usersId).filter((userId) => userId !== id)[0];

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
			game[message.id] = message.message;
			const allChoosen = Object.keys(game).length >= 2;
			if (!allChoosen) {
				ws.send(
					JSON.stringify({
						type: 'game',
						text: 'Ожидайте хода противника',
						disable: true,
					})
				);
				return;
			}
			const winner = getWinner(game);
			if (!winner) {
				broadcastMessage({
					type: 'game',
					text: 'Ничья',
					disable: false,
				});
				game = {};
				return;
			}
			const enemy = getEnemy(game, winner);

			users[winner].score = users[winner].score + 1;
			users[winner].text = 'Победа';
			users[enemy].text = 'Проигрыш';
			game = {};

			broadcastMessage({ type: 'round', users, disable: false });

			users[winner].text = '';
			users[enemy].text = '';
		}
	});
});

function broadcastMessage(message: Record<string, any>) {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
}
