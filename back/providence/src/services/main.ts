import { ASYNC_RESPONSE, CREATE_ROOM_BODY, CREATE_ROOM_RES, JOIN_ROOM_BODY, JOIN_ROOM_RES, LEAVE_ROOM_BODY, LEAVE_ROOM_RES, START_GAME_BODY, START_GAME_RES } from "../../../../classes/types";
import { Room } from "./room";

const gameConf = require("../../../../../../../config/gameConf.json");


export class Main {
    private static instance: Main = new Main();
    private rooms: Map<string , Room> = new Map<string, Room>();

    constructor() {

    }

    private init = (app) => {
        console.log("init Main...");
        this.listenToAllRestPaths(app);
    }

    
    private getRooms = ():  Map<string , Room> => {
        return this.rooms;
    }
       
    private leaveRoom = async (leaveRoomBody: LEAVE_ROOM_BODY): Promise<ASYNC_RESPONSE<LEAVE_ROOM_RES>> => {
        const ans: ASYNC_RESPONSE<LEAVE_ROOM_RES> = {success: false}
        if(this.rooms.has(leaveRoomBody.roomId)){
            const currRoom: Room = this.rooms.get(leaveRoomBody.roomId);
            if(currRoom.getPlayers().has(leaveRoomBody.username)) {
                await currRoom.leaveRoom(leaveRoomBody); 
                if(currRoom.getNumOfPlayers() === 0 ) {
                    this.rooms.delete(leaveRoomBody.roomId);
                }   
                ans.success = true;
            }
            else{
                ans.description = `${leaveRoomBody.username} not exist in Room ${leaveRoomBody.roomId}`
            }
        }
        else{
            ans.description = `Room ${leaveRoomBody.roomId} not exist`
        }
        return ans;
    }

    

    private listenToAllRestPaths = (app) => {
        app.post('/createRoom', (req, res) => {
            const ans: ASYNC_RESPONSE<CREATE_ROOM_RES> = {success: false}
            const createRoomBody: CREATE_ROOM_BODY = req.body;
            if(!this.rooms.has(createRoomBody.roomId)){
                this.rooms.set(createRoomBody.roomId , new Room(createRoomBody));
                ans.success = true;
            }
            else{
                ans.description = `Room ${createRoomBody.roomId} alreat exist`
            }
            res.send(ans)
      })

        app.post('/joinRoom', (req, res) => {
            const ans: ASYNC_RESPONSE<JOIN_ROOM_RES> = {success: false}
            const joinRoomBody: JOIN_ROOM_BODY = req.body;
            if(this.rooms.has(joinRoomBody.roomId)){
                const currRoom: Room = this.rooms.get(joinRoomBody.roomId);
                if(currRoom.getNumOfPlayers() >= gameConf.maxPlayers) {
                    ans.description = `Game in room ${joinRoomBody.roomId} has maximum players` 
                }
                else if(currRoom.gameStarted()) {
                    ans.description = `Game in room ${joinRoomBody.roomId} already started`
                }
                else if(currRoom.getPlayers().has(joinRoomBody.username)) {
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
            else{
                ans.description = `Room ${joinRoomBody.roomId} not exist`
            }
            res.send(ans)
    })

    app.post('/leaveRoom', async(req, res) => {
        const leaveRoomBody: LEAVE_ROOM_BODY = req.body;
        const ans = await this.leaveRoom(leaveRoomBody);
        res.send(ans)
    })

    app.get('/getPlayersByRoom', (req, res) => {
        let ans: any[] = [];
        const getPlayersByRoomBody: {roomId : string} = req.body;
        if(this.rooms.has(getPlayersByRoomBody.roomId)) {
          this.rooms.get(getPlayersByRoomBody.roomId).getPlayers().forEach(bla => {
                ans.push(bla);
            });
        }
    
        res.send(ans)
    })

    app.get('/startGame', (req, res) => {
        const ans: ASYNC_RESPONSE<START_GAME_RES> = {success: false}
        const startRoomBody: START_GAME_BODY = req.body;
        if(this.rooms.has(startRoomBody.roomId)) {
            const currRoom: Room = this.rooms.get(startRoomBody.roomId);
            if(currRoom.getNumOfPlayers() < gameConf.minPlayers) {
                ans.description = `Room ${startRoomBody.roomId} has less then minimum players requierd` 
            }
            else if(currRoom.gameStarted()) {
                ans.description = `Game in room ${startRoomBody.roomId} already started` 
            }
            else{
                currRoom.startGame();
                ans.description = `Game in room ${startRoomBody.roomId} started right now`;
                ans.success = true;
            }
        }
        res.send(ans)
    })
  }

    public static leaveRoom = Main.instance.leaveRoom;
    public static init = Main.instance.init;
    public static getRooms = Main.instance.getRooms;

}

