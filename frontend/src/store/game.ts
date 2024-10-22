import { create } from 'zustand';

interface User {
	id: number;
	username: string;
	score: number;
	text?: string;
}

type Users = Record<string, User>;

type State = {
	id: number;
	users: Users;
	disable: boolean;
	error: string;
};

type Actions = {
	setId: (id: number) => void;
	setUsers: (users: Users) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onMessage: (ev: MessageEvent<any>) => void;
	setDisable: (val: boolean) => void;
};

export const useGameStore = create<State & Actions>((set) => ({
	id: 0,
	users: {},
	disable: false,
	error: '',
	setId: (id) => set({ id }),
	setUsers: (users: Users) => set({ users }),
	setDisable: (disable) => set({ disable }),
	onMessage: (event) => {
		const message = JSON.parse(event.data);

		if (message.type === 'error') {
			set({ error: message.reason });
			return;
		}

		if (message.type === 'connection') {
			set({ users: message.users });

			if (Object.keys(message.users).length <= 1) {
				set({ disable: true });
				return;
			}

			set({ disable: false });
			return;
		}

		if (message.type === 'game') {
			set({ users: message.users });
			return;
		}

		if (message.type === 'round') {
			set({ users: message.users });
			set({ disable: false });
			return;
		}

		if (message.type === 'end') {
			set({ users: message.users });
			set({ disable: true });
			return;
		}
	},
}));

export const useSelectEnemy = (id: string | number) => {
	const users = useGameStore((state) => state.users);
	return Object.values(users).filter((user) => user.id !== id)[0];
};
