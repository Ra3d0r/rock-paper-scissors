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
};

type Actions = {
	setId: (id: number) => void;
	setUsers: (users: Users) => void;
};

export const useGameStore = create<State & Actions>((set) => ({
	id: 0,
	users: {},
	setId: (id) => set({ id }),
	setUsers: (users: Users) => set({ users }),
}));

export const useSelectEnemy = (id: string | number) => {
	const users = useGameStore((state) => state.users);
	return Object.values(users).filter((user) => user.id !== id)[0];
};
