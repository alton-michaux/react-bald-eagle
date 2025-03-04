import { useRef } from "react";
import UserControl from "../modals/UserControl";
import TodoList from "../lists/TodoList";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FloatingDiv } from "../modals/FloatingDiv";
import styles from "../../Assets/css/ListState.module.css";

const CurrentList = ({ todoList, addTodo, currentUser, onDone, show, handleShow, handleClose, handleSearch, updateList }) => {
	let navigate = useNavigate();
	let homePath = '/';
	let path = '/edit';

	const routeChange = (type) => {
		if (type === 'home') {
			navigate(homePath)
		} else {
			navigate(path);
		}
	}

	const tableRef = useRef(null)

	return (
		<div className={styles.currentList}>
			<UserControl
				handler={handleShow}
				searchHandler={handleSearch}
				onClick={() => routeChange('home')}
				routeChange={() => routeChange('edit')}
				path={path}
				updateList={updateList}
				buttonText={"Edit List"}
				currentUser={currentUser}
				tableRef={tableRef.current}
			>Add Task</UserControl>

			<FloatingDiv
				currentUser={currentUser}
				addTodo={addTodo}
				show={show}
				handleClose={handleClose}
			>Add tasks to {currentUser}'s list</FloatingDiv>

			<div className={styles.listDiv}>
				<div className={styles.todoItems}>
					{todoList.isError && <p style={{ color: 'white' }}>Something went wrong...</p>}

					{todoList.isLoading ? <p style={{ color: 'white' }}>Loading...</p>
						: todoList.data.length > 0 ?
							<TodoList todoList={todoList.data} onDone={onDone} path={path} tableRef={tableRef} /> :
							<p style={{ color: 'white' }}>No Data</p>
					}
				</div>
			</div>
		</div>
	)
}

CurrentList.propTypes = {
	todoList: PropTypes.object.isRequired,
	addTodo: PropTypes.func,
	currentUser: PropTypes.string.isRequired,
	onDone: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	handleShow: PropTypes.func,
	handleClose: PropTypes.func,
	handleSearch: PropTypes.func.isRequired,
	updateList: PropTypes.func.isRequired
}

export default CurrentList
