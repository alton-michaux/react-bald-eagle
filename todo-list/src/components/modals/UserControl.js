import React, { useState, useEffect } from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import NavButton from '../inputs-forms/NavButton';
import styles from "../../Assets/css/App.module.css";

const UserControl = ({ searchHandler, handler, children, onClick, updateList, currentUser, buttonText, routeChange, tableRef }) => {
  const [input, setInput] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    setInput(event.target.value)
  }

  useEffect(() => {
    searchHandler(input)
  }, [input, searchHandler])

  return (
    <div className={styles.infoDiv}>
      <h1 className={styles.mainTitle}>{currentUser}'s Todo List</h1>

      <span>
        <Button
          variant='dark'
          onClick={onClick}
          className={styles.openButton}
        >Home</Button>
      </span>

      {
        buttonText === "Edit List" ?
          <span>
            <Button variant="dark" onClick={handler} className={styles.openButton}>
              {children}
            </Button>
          </span> : <></>
      }

      <span>
        <NavButton
          type="button"
          action={routeChange}
          path={'/edit'}
        >{buttonText}</NavButton>
      </span>

      <span>
        <Button variant="dark" onClick={updateList} className={styles.openButton}>
          Refresh List
        </Button>
      </span>

      <DownloadTableExcel
        filename="todo list"
        sheet="todos"
        currentTableRef={tableRef}
      >

        <Button variant="dark" className={styles.openButton}> Export List </Button>

      </DownloadTableExcel>

      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search List"
        onChange={handleSearch}
      ></input>
    </div>
  )
}

UserControl.propTypes = {
  searchHandler: PropTypes.func,
  handler: PropTypes.func,
  children: PropTypes.string,
  onClick: PropTypes.func,
  updateList: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  routeChange: PropTypes.func,
  tableRef: PropTypes.object
}

export default UserControl
