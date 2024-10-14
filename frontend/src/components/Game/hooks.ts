import { useEffect, useState } from 'react';

export interface User {
	id: number;
	username: string;
	score: number;
	text?: string;
}

export type Users = Record<string, User>;

export const useHandleConnection = (socket: WebSocket, id: number) => {
	const [users, setUsers] = useState<Users>();
	const [error, setError] = useState<string | null>(null);
	const [disable, setDisable] = useState(false);

	useEffect(() => {
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message);

			if (message.type === 'error') {
				setError(message.reason);
				return;
			}

			if (message.type === 'connection') {
				setUsers(message.users);
				return;
			}

			if (message.type === 'game') {
				setUsers(message.users);
				return;
			}

			if (message.type === 'round') {
				setUsers(message.users);
				setDisable(false);
				return;
			}
		};
		socket.onclose = () => {
			console.log('Socket закрыт');
		};
		socket.onerror = () => {
			console.log('Socket произошла ошибка');
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onClick = (message: string) => {
		socket.send(
			JSON.stringify({
				id,
				message,
				event: 'game',
			})
		);
		setDisable(true);
	};

	return { users, error, disable, onClick };
};
