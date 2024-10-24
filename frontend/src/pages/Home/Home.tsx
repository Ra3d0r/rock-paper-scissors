import { useFormAction } from './hook';
import styles from './Home.module.scss';

export const Home = () => {
	const { onSubmit } = useFormAction();

	return (
		<form onSubmit={onSubmit} className={styles.form}>
			<h2>Введите любой ник для подключения к игре и нажмите Enter</h2>
			<input type="text" name="username" className={styles.input} />
			<button type="submit">Подключиться</button>
		</form>
	);
};
