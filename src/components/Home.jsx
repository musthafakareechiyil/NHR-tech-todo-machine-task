import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import CreateTodo from './CreateTodo';
import Swal from 'sweetalert2';



function Home() {
  const [todos, setTodos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const closeModal = () => {
    setIsOpen(false)
  }

  // Fetch tasks from server
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/todos')
        setTodos(response.data)
      }catch (err){
        console.error('Error while fetching data',err);
      }
    }
    fetchTodos()
  },[isOpen])

  // Show and Hide description
  const handleTodoClick = (id) => {
    setSelectedTodo((prevSelectedTodo) =>
      prevSelectedTodo === id ? null : id
    );
  };

  const handleRemoveTodo = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete the task from history?");

    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3000/todos/${id}`);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleTaskDone = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/todos/${id}`, { status: 'completed' });
  
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, status: 'completed' } : todo
        )
      );
  
      Swal.fire({
        title: 'Task done yaaaaay!',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleIncompleteTask = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This task will be marked as incomplete!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
        cancelButtonText: 'Cancel',
      });
  
      if (result.isConfirmed) {
        await axios.patch(`http://localhost:3000/todos/${id}`, { status: 'incomplete' });
  
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, status: 'incomplete' } : todo
          )
        );
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="w-full p-4 flex items-center bg-white shadow-md">
        <div className="mr-4 w-10">
          <img src='/src/assets/todo icon bg-removed.png' alt="Todo Icon" />
        </div>
        <h1 className="text-xl font-bold">NHR To-Do List</h1>
        <div className='bg-green-500 flex items-center justify-center m-2 p-2 rounded-md hover:bg-green-600 transition-colors duration-300'
          onClick={() => setIsOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus}/>
        </div>
        <div className='flex-grow'></div>
        <div className='bg-green-500 flex items-center justify-center p-2 rounded-md mr-4 hover:bg-green-600 transition-colors duration-300'
          onClick={() => setIsOpen(true)}
        >
          <h1 className='font-bold mr-2'>Add task</h1>
          <FontAwesomeIcon icon={faPlus}/>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto px-4 py-8 mt-12 w-full">
        {/* Boxes for Completed, Pending, and Incomplete */}
        <div className="flex justify-between mb-4 h-5/6">

          {/* Completed Box */}
          <div className="flex-grow bg-green-200 p-4 rounded-md shadow-2xl w-1/6">
            <h2 className="text-lg font-bold flex justify-center cursor-pointer">
              Completed
            </h2>
            <div className='w-full border-2 border-black mt-4'></div>
            <ul className="mt-4">

              {todos.map((todo) => (
                // Check if the status is "completed" for each individual todo
                todo.status === "completed" && (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between mb-2 p-2 hover:bg-green-300 rounded-md transition-colors duration-300 border-b-2 shadow-md"
                  >
                    <div>
                      <span
                        className="cursor-pointer underline"
                        onClick={() => handleTodoClick(todo.id)}
                      >
                        {todo.title}
                      </span>
                      {selectedTodo === todo.id && (
                        <p className="text-sm mt-1 max-w-1/2">{todo.description}</p>
                      )}
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleRemoveTodo(todo.id)}
                      />
                    </div>
                  </li>
                )
              ))}

            </ul>
          </div>
          
          {/* Pending Box */}
          <div className="flex-grow bg-yellow-100 p-4 rounded-md mx-4 shadow-2xl w-1/6">
            <h2 className="text-lg font-bold flex justify-center cursor-pointer">
              Pending
            </h2>
            <div className='w-full border-2 border-black mt-4'></div>
            <ul className="mt-4">
              {todos.map((todo) => (
                todo.status === 'pending' && (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between mb-2 p-2 hover:bg-yellow-200 transition-colors duration-300 rounded-md border-b-2 shadow-md"
                  >
                    <div>
                      <span
                        className="cursor-pointer underline"
                        onClick={() => handleTodoClick(todo.id)}
                      >
                        {todo.title}
                      </span>
                      {selectedTodo === todo.id && (
                        <p className="text-sm mt-1">{todo.description}</p>
                      )}
                    </div>
                    <div>
                      {/* Use the FontAwesome icons for tick and cross */}
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-green-800 cursor-pointer mr-5"
                        onClick={() => handleTaskDone(todo.id)}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleIncompleteTask(todo.id)}
                      />
                    </div>
                  </li>
                )
              ))}
            </ul>
          </div>
          
          {/* Incomplete Box */}
          <div className="flex-grow bg-orange-200 p-4 rounded-md shadow-2xl w-1/6">
            <h2 className="text-lg font-bold flex justify-center cursor-pointer">
              Incomplete
            </h2>
            <div className='w-full border-2 border-black mt-4'></div>
            <ul className="mt-4">
              {todos.map((todo) => (
                todo.status === 'incomplete' && (
                  <li
                  key={todo.id}
                  className="flex items-center justify-between mb-2 p-2 hover:bg-orange-300 rounded-md transition-colors duration-300 border-b-2 shadow-md"
                >
                  <div>
                    <span
                      className="cursor-pointer underline"
                      onClick={() => handleTodoClick(todo.id)}
                    >
                      {todo.title}
                    </span>
                    {selectedTodo === todo.id && (
                      <p className="text-sm mt-1">{todo.description}</p>
                    )}
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleRemoveTodo(todo.id)}
                    />
                  </div>
                </li>
                )
              ))}
            </ul>
          </div>

        </div>
        <CreateTodo isOpen = {isOpen} closeModal={closeModal} />
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <p className="text-sm text-gray-600">NHR Technologies Pvt. Ltd.</p>
      </footer>
    </div>
  );
}

export default Home;
