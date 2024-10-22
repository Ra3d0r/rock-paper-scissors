import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/game';
import { useWebSocketStore } from '../../store/websocket';

export interface User {
	id: number;
	username: string;
	score: number;
	text?: string;
}

export type Users = Record<string, User>;

export const useHandleConnection = () => {
	const id = useGameStore((state) => state.id);
	const users = useGameStore((state) => state.users);
	const setUsers = useGameStore((state) => state.setUsers);
	const socket = useWebSocketStore((state) => state.webSocket);

	const [error, setError] = useState<string | null>(null);
	const [disable, setDisable] = useState(false);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);

			if (message.type === 'error') {
				setError(message.reason);
				return;
			}

			if (message.type === 'connection') {
				setUsers(message.users);
				if (Object.keys(message.users).length <= 1) {
					setDisable(true);
					return;
				}
				setDisable(false);
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

			if (message.type === 'end') {
				setUsers(message.users);
				setDisable(true);
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
		socket?.send(
			JSON.stringify({
				id,
				message,
				event: 'game',
			}),
		);
		setDisable(true);
	};

	return { users, error, disable, onClick, id };
};
