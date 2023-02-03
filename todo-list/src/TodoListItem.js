/* eslint-disable no-sequences */
import React from "react";
import styles from "./TodoListItem.module.css"

const TodoListItem = ({ todo, onRemoveTodo }) => {
  const removeTodo = () => {
    onRemoveTodo(todo.id)
  }
  return (
    <li className={styles.itemTextColor}>
      <b>{todo.fields.Name} </b>
      <button className={`btn ${styles.removeTodo} btn-dark`} type="button" onClick={removeTodo}>
        Remove
      </button>
    </li>
  );
};

export default TodoListItem;
