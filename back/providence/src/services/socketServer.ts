import { SOCKET_ENUMS } from "../../../../classes/socketEnums";
import { LEAVE_ROOM_BODY, SOCKET_JOIN_ROOM_OBJ } from "../../../../classes/types";
import { Main } from "./main";
import { User } from "./player";

const { Server } = require("socket.io");
const servConf = require("../../../../../../../config/services.json");



export class SocketServer {
    private static instance: SocketServer = new SocketServer();

    private ioServer;


    constructor() {

    }

    private init = (server) => {
        console.log("init Socket-Server....");
        this.ioServer = new Server(server, {
            cors: {
                // origin: `${servConf.UI.protocol}://${servConf.UI.host}:${servConf.UI.port}`, // TODO: need to config and check what to put here
                // methods: ["GET","POST"]
            }
        });

        
        this.ioServer.on("connection" , (socket) => {
            console.log(`User Connected: ${socket.id}`);

            socket.on('disconnect', async () => {
                let leaveRoomBody: LEAVE_ROOM_BODY = undefined;
                console.log(`user disconnected ${socket.id}`);
                Main.getRooms().forEach(room => {
                    room.getPlayers().forEach(player => {
                        if(player.getSocketId() === socket.id) {
                            leaveRoomBody =  {roomId: room.getRoomId() , username: player.getUserName()}
                        }
                    })
                })
                if(leaveRoomBody !== undefined) {
                    await Main.leaveRoom(leaveRoomBody);
                    const currRoom =  Main.getRooms().get(leaveRoomBody.roomId);
                    if(currRoom) {
                        const newPlayersUsernames = {
                            playersUsername: currRoom.getPlayersUsername(),
                        }
                        SocketServer.sendGameMessage(currRoom.getRoomId(), SOCKET_ENUMS.NEW_PLAYER_LEAVE , newPlayersUsernames );
                    }
                }
              });
            
            socket.on("join_room" , (data: {roomId: string , username: string }, cb) => {
                if(Main.getRooms().has(data.roomId)) {
                    const currRoom =  Main.getRooms().get(data.roomId);
                    if(currRoom.getPlayers().has(data.username)) {
                        const currPlayer = currRoom.getPlayers().get(data.username);
                        currPlayer.setSocketId(socket.id);
                        socket.join(data.roomId);
                        console.log(`${data.username} joind to room: ${data.roomId}`);
                        //NEED TO SEND ONLY RELEVANT DATA!!! TO UI
                        const newPlayersUsernames = {
                            playersUsername: currRoom.getPlayersUsername(),
                        }
                        SocketServer.sendGameMessage(currRoom.getRoomId(), SOCKET_ENUMS.NEW_PLAYER_JOIN , newPlayersUsernames );
                        const joinRoomObj:SOCKET_JOIN_ROOM_OBJ = {
                            playersUsername: currRoom.getPlayersUsername(),
                            youAdmin: currPlayer.isAdmin()
                        }
                        cb(JSON.stringify(joinRoomObj));
                    }
                    else{
                        console.log(`Player ${data.username} Not exist`);
                    }
                }
                else{
                    console.log(`Room: ${data.roomId} Not exist`);
                }
                //check if room exist , and username
               // Main.getRooms().get(data.roomId).getPlayers().get(data.username).setSocketID(socket.id);
            })

            // socket.on("send_message" , (data) => {
            //     socket.to(data.room).emit("recieve_message" , data);
            // });

        })
    }

    private sendPrivateMessage = (clientID: string ,subject:string , message: any) => {
        this.ioServer.to(clientID).emit(subject , message);
    }

    private sendGameMessage = (roomId: string ,subject:string, message: any) => {
        console.log(subject , message);
        this.ioServer.to(roomId).emit(subject , message);
    }

    private leaveClient = async(roomId:string , socketId: string) => {
        const currRoom =  Main.getRooms().get(roomId);
        const sockets = await this.ioServer.in(roomId).fetchSockets();
        sockets.forEach(socket => {
            if(socket.id === socketId) {
                socket.leave(roomId);
                const newPlayersUsernames = {
                    playersUsername: currRoom.getPlayersUsername(),
                }
                SocketServer.sendGameMessage(currRoom.getRoomId(), SOCKET_ENUMS.NEW_PLAYER_LEAVE , newPlayersUsernames );
                SocketServer.sendPrivateMessage(socketId ,SOCKET_ENUMS.ADMIN_DISMISS_YOU ,`BYE BYE FROM ROOM ${roomId}`);
            }
        })  
    }
    
    public static init = SocketServer.instance.init;
    public static sendPrivateMessage = SocketServer.instance.sendPrivateMessage;
    public static sendGameMessage = SocketServer.instance.sendGameMessage;
    public static leaveClient = SocketServer.instance.leaveClient;

}

