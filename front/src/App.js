import "./App.css";
import { useState } from "react";
import Room from "./Components/Room/Room";
import Home from "./Components/Home/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [gameType, setGameType] = useState("");

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              setGameType={setGameType}
              setUsername={setUsername}
              setRoomId={setRoomId}
            ></Home>
          }
        />
        <Route
          path="/room/:id"
          element={
            <Room
              roomId={roomId}
              username={username}
              // game={gameType}
            ></Room>
          }
        />
      </Routes>
      {/* {!inRoom && (
        <Home
          setGameType={setGameType}
          setUsername={setUsername}
          setRoomId={setRoomId}
          setInRoom={setInRoom}
        ></Home>
      )}
      {inRoom && (
        <Room
          setInRoom={setInRoom}
          roomId={roomId}
          username={username}
          game={gameType}
        ></Room>
      )} */}
    </div>
  );
}

export default App;
