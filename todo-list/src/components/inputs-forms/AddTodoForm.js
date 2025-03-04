import React from "react";
import PropTypes from "prop-types";
import InputWithLabel from "./InputWithLabel";
import styles from '../../Assets/css/AddTodoForm.module.css';

const AddTodoForm = ({ onAddTodo }) => {
  const [todoTitle, setTodoTitle] = React.useState("");

  const handleTitleChange = (event) => {
    const newTodoTitle = event.target.value;
    setTodoTitle(newTodoTitle);
  };

  const handleAddTodo = (event) => {
    event.preventDefault();
    onAddTodo({ Name: todoTitle, id: Date.now(), Done: false });
    setTodoTitle("");
  };

  return (
    <form className={`${styles.inputForm} form-floating`} onSubmit={handleAddTodo}>
      <InputWithLabel
        todoTitle={todoTitle}
        handleChange={handleTitleChange}
        name="Title"
        type="text"
        id="TodoTitle"
      >
      </InputWithLabel>
      <button className={`${styles.addTodoButton} btn btn-dark`} type="submit"> Add Task </button>
    </form>
  );
};

AddTodoForm.propTypes = {
  onAddTodo: PropTypes.func.isRequired
}

export default AddTodoForm;
