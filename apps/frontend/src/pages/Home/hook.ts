import { FormEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { WS_URL } from '@/config';
import { useGameStore } from '@/store/game';
import { useWebSocketStore } from '@/store/websocket';

export const useFormAction = () => {
	const setWebSocket = useWebSocketStore((state) => state.setWebSocket);
	const setId = useGameStore((state) => state.setId);
	const onmessage = useGameStore((state) => state.onMessage);
	const onError = useGameStore((state) => state.onError);
	const resetAll = useGameStore((state) => state.resetAll);
	const navigate = useNavigate();

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const username = new FormData(form).get('username');

		const socket = new WebSocket(WS_URL);
		const id = Date.now();

		socket.onopen = () => {
			const message = {
				event: 'connection',
				username,
				id,
			};
			socket.send(JSON.stringify(message));
		};

		socket.onclose = () => {
			console.log('Socket закрыт');
			resetAll();
			navigate('/');
		};
		socket.onerror = () => onError();

		socket.onmessage = (e) => onmessage(e);

		setId(id);
		setWebSocket(socket);
		navigate('/game');
	};

	return { onSubmit };
};
