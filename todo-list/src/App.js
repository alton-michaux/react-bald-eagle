import React, { useState, useEffect, useReducer, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import ListReducer from "./Reducer";
import NewList from "./components/New";
import CurrentList from "./components/Current";
import EditList from "./components/Edit";

const App = () => {
  const [todoList, dispatchTodoList] = useReducer(ListReducer,
    { data: {}, isLoading: false, isError: false })
  const [endpoint, setEndpoint] = useState('')
  const [user, setUser] = useState('')
  const [show, setShow] = useState(false)

  const getUser = () => {
    setUser(prompt('Please enter your name'))
  }

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')))
    } else {
      getUser()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

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
        const sortedRecords = data.records.sort((recordA, recordB) => {
          if (recordA.fields.Name > recordB.fields.Name) {
            return 1
          }
          if (recordA.fields.Name < recordB.fields.Name) {
            return -1
          } else {
            return 0
          }
        })
        dispatchTodoList({ type: 'LIST_FETCH_SUCCESS', payload: [...sortedRecords] })
      } else {
        dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
      }
    }
    catch {
      dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
    }
  }, [endpoint])

  const addTodo = async (newTodo) => {
    const formattedTodo = {}

    // format for API
    Object.keys(newTodo).forEach(function (key) {
      if (key !== "id") {
        formattedTodo[key] = newTodo[key]
      }
      return formattedTodo
    })

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
              ...formattedTodo
            }
          }
        ]
      })
    }

    try {
      const response = await fetch(endpoint, options)

      if (response.ok) {
        const newFormat = {
          id: newTodo.id.toString(),
          fields: {
            ...formattedTodo
          }
        }

        const newTodos = [...todoList.data, newFormat]

        dispatchTodoList({
          type: 'LIST_FETCH_SUCCESS',
          payload: [...newTodos]
        })
      }
    }
    catch {
      dispatchTodoList({ type: 'LIST_FETCH_FAILURE' })
    }
  };

  const handleDoneChange = async (boolean, todo) => {
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "fields": {
          "Name": `${todo.fields.Name}`,
          "Done": boolean
        }
      })
    }

    try {
      await fetch(`${endpoint}/${todo.id}`, options)
    }
    catch {
      alert("Failed to change the task status. Please refresh the page and try again")
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
        'Content-Type': 'application/json',
      },
    }
    try {
      const response = await fetch(`https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Tasks/${id}`, options)

      if (response.ok) {
        const newTodos = todoList.data.filter(todo => todo.id !== id)

        dispatchTodoList({
          type: 'LIST_FETCH_SUCCESS',
          payload: [...newTodos]
        })
      }
    }
    catch {
      alert("Failed to remove task. Please refresh the page and try again")
    }
  };

  const handleListFilter = (input) => {
    const filteredList = todoList?.data?.filter((data) => {
      return (
        data.fields.Name.includes(input)
      )
    })
    dispatchTodoList({type: 'LIST_FETCH_SUCCESS', payload: [...filteredList]})
  }

return (
  <BrowserRouter>
    <Routes>
      <Route
        exact
        path='/'
        element={
          <CurrentList
            todoList={todoList}
            addTodo={addTodo}
            removeTodo={removeTodo}
            onDone={handleDoneChange}
            currentUser={user}
            show={show}
            setShow={setShow}
            handleClose={handleClose}
            handleShow={handleShow}
            handleSearch={handleListFilter}
          ></CurrentList>
        }
      >
      </Route>
      <Route
        exact
        path='/edit'
        element={
          <EditList
            user={user}
            todoList={todoList}
            removeTodo={removeTodo}
            show={show}
            setShow={setShow}
            handleClose={handleClose}
            handleShow={handleShow}
            handleSearch={handleListFilter}
          ></EditList>
        }
      ></Route>
      <Route
        exact
        path='/new'
        element={
          <NewList
            addTodo={addTodo}
          ></NewList>
        }
      ></Route>
    </Routes>
  </BrowserRouter>
);
};

App.propTypes = {
  todoList: PropTypes.object,
  addTodo: PropTypes.func,
  removeTodo: PropTypes.func,
  handleDoneChange: PropTypes.func,
  user: PropTypes.string
}

export default App;
