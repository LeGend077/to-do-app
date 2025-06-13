import { useState, useEffect, useRef } from 'react';
import './App.css';

import { v4 as uuidv4 } from 'uuid'

// useState -> Change DOM content without page reload. It causes a re-render.

// useEffect -> Run events if a value is changed, or if a re-render is occured.

// useRef -> During re-render of a component, variable get reset to their initial value. Using useRef, we can define a value which do not reset while re-rendering. Another use case that, we can add ref prop to a DOM element inside which we can add our useRef variable, so that we can use that element's info anywhere (like document.getElementById).

// In react, if we want to update a state in accordance to a input, we put an function into onChange of the input and then add a state value of the input and get that value of the state and then set it to value of input.

// Creating elements from an array requires us to set an unique key prop to the component.

function Todo(item, handleCheckbox, finishedTodo, handleDelete) {
  return (
    <li key={item.id} className='flex justify-between list-none'>
      <span>
        <input type="checkbox" name={item.id} id="" className="w-4 h-4 mx-2" onChange={handleCheckbox} checked={item.isCompleted} />{item.content}
      </span>
      {finishedTodo ?
        <span>
          <button className='btn text-xs px-1 py-0.5' id={item.id} onClick={handleDelete}>Delete</button>
        </span> : ''}
    </li>
  )
}

function App() {
  const defaultTodo = {
    id: uuidv4(),
    content: '',
    isCompleted: false
  }
  const [todos, setTodos] = useState([])

  const [newTodo, setNewTodo] = useState(defaultTodo)

  const [showFinished, setShowFinished] = useState(false)

  // When this page renders for the first time, we set Todos into their places.
  useEffect(() => {
    let todosArray = JSON.parse(localStorage.getItem('todos')) ?? false

    if (todosArray) {
      setTodos(todosArray)
    } else {
      localStorage.setItem('todos', JSON.stringify([]))
    }
  }, [])

  const handleNewTodoValue = (e) => {
    setNewTodo(
      {
        id: uuidv4(),
        content: e.target.value,
        isCompleted: false
      }
    )
  }

  const addNewTodo = () => {
    let todosArray = JSON.parse(localStorage.getItem('todos')) ?? false

    if (newTodo.content === '' || undefined) {
      alert('Todo cannot be empty!')
    } else {
      // (spread) means all the things in todos plus the one on right
      localStorage.setItem('todos', JSON.stringify([...todosArray, newTodo]))
      setTodos([...todos, newTodo])

      setNewTodo(defaultTodo)
    }
  }

  // const [completed, setCompleted] = useState(false)

  const handleCheckbox = (e) => {
    let id = e.target.name
    const index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted

    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))

    // console.log(e.target.checked)
  }

  const showHidden = () => {
    setShowFinished(!showFinished)
  }

  const handleDelete = (e) => {
    const id = e.target.id
    let newTodos = todos.filter(item => {
      return item.id !== id;
    })

    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }

  return (
    <>
      <div className='w-3/4 bg-slate-200 mx-auto my-10 rounded-2xl px-3 py-3'>

        <h1 className='text-center text-3xl font-bold'>TODO LIST</h1>

        <hr />

        <h2 className='text-2xl text-center'>Your List</h2>

        <div className='bg-slate-300 rounded-2xl px-3 py-3 flex'>
          <input type="text" className='inp-text' placeholder='Add a new task...' value={newTodo.content ?? ''} onChange={handleNewTodoValue} />

          <button className='btn' onClick={addNewTodo}>Create</button>
          <button className='btn' onClick={showHidden}>{showFinished ? 'Hide Finished' : 'Show Finished'}</button>
        </div>
        <div className='bg-slate-300 rounded-2xl px-3 py-3 my-3'>
          <ul>
            {/* Setting html for each entry in todos array */}
            {
              todos.length ?
                todos.map(item => {
                  if (item.isCompleted && showFinished) {
                    return Todo(item, handleCheckbox, true, handleDelete)
                  } else if (!showFinished && !item.isCompleted) {
                    return Todo(item, handleCheckbox, false, handleDelete)
                  }
                }) : <div className='text-center text-gray-400'>You completed all the tasks!</div>
            }
          </ul>
        </div>
      </div>
    </>
  )
}

export default App