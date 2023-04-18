import { SERVER_URL } from "../../Enums/enums";
import axios from "axios";
import { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import CardsRoom from "../CardsRoom/CardsRoom";
import CreateRoomModal from "../CreateRoomModal/CreateRoomModal";
import { useNavigate } from "react-router-dom";
const serverURL = `${SERVER_URL.protocol}://${SERVER_URL.host}:${SERVER_URL.port}`;


const Home = (props) => {

    const [allRooms, setAllRooms] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [createRoomError, setCreateRoomError] = useState("");

    const navigate = useNavigate();

    const setGameType = props.setGameType;
    const setUsername = props.setUsername;
    const setRoomId = props.setRoomId;


    useEffect(() => {
        getAllRooms();
      }, []);
    
      const createRoom = async (modalObj) => {
        console.log(modalObj);
        const response = await axios.post(`${serverURL}/createRoom`, modalObj);
        const data = response.data;
        console.log(data);
    
        if (data.success) {
          setModalShow(false);
          setRoomId(modalObj.roomId);
          setUsername(modalObj.username);
          setGameType(modalObj.game);
          localStorage.clear();
          localStorage.setItem('username', JSON.stringify(modalObj.username));
          navigate(`/room/${modalObj.roomId}`);
        } else {
          setCreateRoomError(data.description);
          console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
        }
      };
    
      const getAllRooms = async () => {
        const response = await axios.get(`${serverURL}/getAllRooms`);
        const data = response.data;
        if (data.success) {
          setAllRooms(data.data);
          console.log(data.data);
        } else {
          console.log(`BLA BLA BLA BLA BLA BLA BLA BLA`);
        }
      };
    

  return (
    <>
      <CardsRoom
        allRooms={allRooms}
        setRoomId={setRoomId}
        setUsername={setUsername}
      ></CardsRoom>
      <br></br>
      <br></br>
      <CreateRoomModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        createRoomError={createRoomError}
        createRoomCallback={createRoom}
      />
      <div className="d-grid gap-2">
        <button
          className="create-room-button"
          onClick={() => setModalShow(true)}
        >
          Create Room <AiOutlinePlus />
        </button>
      </div>
    </>
  );
};

export default Home;
