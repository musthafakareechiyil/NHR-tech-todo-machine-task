import axios from 'axios';
import React, { useState } from 'react';

function CreateTodo({ isOpen, closeModal }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showError, setShowError] = useState(false);

  const handleAddTodo = async () => {
    try {
      if (!title.trim()) {
        setShowError(true);
        return;
      }
  
      const response = await axios.post("http://localhost:3000/todos", {
        title: title,
        description: description
      });
  
      if (response.status >= 200 && response.status < 300) {
        setTitle('');
        setDescription('');
        setShowError(false);
        closeModal();
      } else {
        console.error(`Server returned an error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };
  
  

  return (
    <div>
      {/* Add task Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center top-0 left-0 right-0 z-50 backdrop-blur-sm w-full h-full"
          onClick={closeModal}
        >
          <div
            className="bg-white w-96 p-4 rounded-md shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-4">
              <h2 className="text-xl font-bold">Add your task</h2>
            </div>

            {/* Modal Form */}
            <form>
              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
                {showError && !title.trim() && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>

              {/* Description Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Description</label>
                <textarea
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  rows="3"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Add Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                  onClick={handleAddTodo}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTodo;
