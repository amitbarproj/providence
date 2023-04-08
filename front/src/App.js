import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import { useState } from "react";



const socket = io.connect("http://localhost:3002");

socket.on('recieve_message', (d) => {
  if(d === "DISCONNECT!") {
    socket.disconnect();
  }
  else{
    console.log(d);
  }
})

function App() {

  const [username, setUsername] = useState("");

  const handleChange = event => {
    setUsername(event.target.value);
  }
  
  

  const sendMessage = () => {
    socket.emit("join_room", {roomId: "111" , username: username });
  }

  return (
    <div className="App">
               <input type="username" value={username} onChange={handleChange} />

        <button
  onClick={() => sendMessage()}
>
  Click me
</button>
    </div>
  );
}

export default App;
