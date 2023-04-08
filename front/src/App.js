import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
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


  const sendMessage = () => {
    socket.emit("join_room", {roomId: "111" , username: "amitbar101" });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button
  onClick={() => sendMessage()}
>
  Click me
</button>
      </header>
    </div>
  );
}

export default App;
