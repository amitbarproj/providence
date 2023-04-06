import { ASYNC_RESPONSE, CREATE_ROOM_BODY, CREATE_ROOM_RES, JOIN_ROOM_BODY, JOIN_ROOM_RES } from "../../../../classes/types";
import { Room } from "./room";


export class Main {
    private static instance: Main = new Main();
    private rooms: Map<string , Room>

    constructor() {

    }

    private init = (app) => {
        console.log("init Main...");
        this.rooms = new Map<string, Room>();
        this.listenToAllRestPaths(app);
    }

    
    private listenToAllRestPaths = (app) => {
        app.post('/createRoom', (req, res) => {
            const ans: ASYNC_RESPONSE<CREATE_ROOM_RES> = {success: false}
            const createRoomBody: CREATE_ROOM_BODY = req.body;
            if(!this.rooms.has(createRoomBody.roomId)){
                this.rooms.set(createRoomBody.roomId , new Room(createRoomBody));
                ans.success = true;
            }
            res.send(ans)
      })

      app.post('/joinRoom', (req, res) => {
        const ans: ASYNC_RESPONSE<JOIN_ROOM_RES> = {success: false}
        const joinRoomBody: JOIN_ROOM_BODY = req.body;
        if(this.rooms.has(joinRoomBody.roomId)){
            const currRoom: Room = this.rooms.get(joinRoomBody.roomId);
            if(currRoom.getPlayers().has(joinRoomBody.username)) {
                ans.description = `${joinRoomBody.username} already exist in Room ${joinRoomBody.roomId}`
            }
            else if(currRoom.needAuth && currRoom.getSecret() !== joinRoomBody.secret) {
                ans.description = `Room secret invalid`
            }
            else{
                currRoom.joinRoom(joinRoomBody);
                // if success, client need to join_room with socket.io to start recieve messages
                ans.success = true;
            }
        
        }
        res.send(ans)
  })

      app.get('/blaa', (req, res) => {
        res.send('Hello World!!!')
  })
    }


    public static init = Main.instance.init;
}

