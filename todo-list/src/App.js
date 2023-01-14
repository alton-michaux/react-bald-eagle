import React, { useState, useEffect, useReducer, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "./TodoList";
import AddTodoForm from "./AddTodoForm";
import ListReducer from "./Reducer";

const App = () => {
  const [todoList, dispatchTodoList] = useReducer(ListReducer,
    { data: {}, isLoading: false, isError: false })
  const [endpoint, setEndpoint] = useState('')


  const fetchTodos = useCallback(async () => {
    if (!endpoint) return

    const options = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`
      }
    }

    dispatchTodoList({ type: 'LIST_FETCH_INIT' })
    try {
      const response = await fetch(endpoint, options)

      if (response.ok) {
        const data = await response.json()

        dispatchTodoList({ type: 'LIST_FETCH_SUCCESS', payload: [...data.records] })
      } else {
        dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
      }
    }
    catch {
      dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
    }
  }, [endpoint])

  const addTodo = async (newTodo) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "records": [
          {
            "fields": {
              "Name": `${newTodo.title}`
            }
          }
        ]
      })
    }

    try {
      const response = await fetch(endpoint, options)

      if (response.ok) {
        fetchTodos()
      }
      dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
    }
    catch {
      dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
    }
  };

  useEffect(() => {
    setEndpoint(`https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Tasks`)
    setTimeout(() => {
      fetchTodos()
    }, 2000)
  }, [fetchTodos])

  const removeTodo = async (id) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: JSON.stringify(`{--data-urlencode 'records[]=${[id]}}'`),
    }
    try {
      const response = await fetch(endpoint, options)
      
      if (response.ok) {
        console.log('response', response)
        fetchTodos();
      }
    }
    catch {
      dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path='/'
          element={
            <div style={{ textAlign: "center" }}>
              <h1>Todo List</h1>

              <AddTodoForm onAddTodo={addTodo} />

              {todoList.isError && <p>Something went wrong...</p>}

              {todoList.isLoading ? <p>Loading...</p>
                : todoList.data.length > 0 ?
                  <TodoList todoList={todoList.data} onRemoveTodo={removeTodo} /> :
                  <p>No Data</p>
              }
            </div>
          }
        >
        </Route>
        <Route
          exact
          path='/new'
          element={
            <div style={{ textAlign: "center" }}>
              <h1>New Todo List</h1>
            </div>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
