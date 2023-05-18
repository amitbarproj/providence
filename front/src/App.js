import "./App.css";
import { useState } from "react";
import Room from "./Components/Room/Room";
import Rooms from "./Components/Rooms/Rooms";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import Home from "./Components/Home/Home";

function App() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [gameType, setGameType] = useState("");

  return (
    <div
      className="App"
    >
      <Routes>
        <Route
          path="/"
          element={
            <Home
             
            ></Home>
          }
        />
         <Route
          path="/rooms"
          element={
            <Rooms
              setGameType={setGameType}
              setUsername={setUsername}
              setRoomId={setRoomId}
            ></Rooms>
          }
        />
        <Route
          path="/room/:id"
          element={<Room roomId={roomId} username={username}></Room>}
        />
        <Route path="*" element={<PageNotFound></PageNotFound>} />
      </Routes>
    </div>
  );
}

export default App;
