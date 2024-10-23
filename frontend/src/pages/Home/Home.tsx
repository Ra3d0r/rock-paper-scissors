import { useFormAction } from './hook';

export const Home = () => {
	const { onSubmit } = useFormAction();

	return (
		<form onSubmit={onSubmit}>
			<h2>Введите любой ник для подключения к игре и нажмите Enter</h2>
			<input type="text" name="username" />
			<button type="submit">Подключиться</button>
		</form>
	);
};
