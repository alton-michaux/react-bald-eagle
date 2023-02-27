import React from "react";
import PropTypes from "prop-types";
import TodoListItem from "./TodoListItem";
import styles from "../../Assets/css/TodoList.module.css";

const TodoList = ({ todoList, onRemoveTodo, onDone, path, tableRef }) => {
  return (
    <ul className={styles.todoList} style={{ listStyleType: "none" }} ref={tableRef}>
      {todoList.map(function (todo) {
        return (
          <TodoListItem key={todo.id} todo={todo} onRemoveTodo={onRemoveTodo} handleDoneChange={onDone} path={path} />
        );
      })}
    </ul>
  )
};

TodoList.propTypes = {
  todoList: PropTypes.array.isRequired,
  onRemoveTodo: PropTypes.func,
  onDone: PropTypes.func,
  path: PropTypes.string,
  tableRef: PropTypes.object.isRequired
}

export default TodoList;
