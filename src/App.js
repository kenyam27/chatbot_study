import React, { useState } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_input: userInput }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_input">
            ユーザー入力:
          </label>
          <input
            type="text"
            id="user_input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            送信
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h3 className="text-gray-800 font-bold">レスポンス:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
