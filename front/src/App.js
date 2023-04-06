import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
const socket = io.connect("http://localhost:3002");




function App() {

  const sendMessage = () => {
    socket.emit("bla", "BLA");
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
