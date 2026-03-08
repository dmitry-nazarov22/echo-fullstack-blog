import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchLocations();
  }, []);

  return (
    <ul>
      {users.map((usr) => (
        <li key={usr.id}>{usr.username}</li>
      ))}
    </ul>
  );
}

export default App
