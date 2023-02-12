import styles from "../Assets/css/App.module.css"

const NavButton = ({ type, action, children, path }) => {
	const handleClick = (path) => {
		action(path)
	}
	return (
		<button className={`btn ${styles.addTodo} ${styles.navigationButton} btn-dark`} type={type} onClick={handleClick}>{children}</button>
	)
}

export default NavButton