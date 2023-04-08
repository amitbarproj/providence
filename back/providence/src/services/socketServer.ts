import { LEAVE_ROOM_BODY } from "../../../../classes/types";
import { Main } from "./main";
import { Player } from "./player";

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
                origin: `${servConf.UI.protocol}://${servConf.UI.host}:${servConf.UI.port}`, // TODO: need to config and check what to put here
                methods: ["GET","POST"]
            }
        });

        
        this.ioServer.on("connection" , (socket) => {
            console.log(`User Connected: ${socket.id}`);

            socket.on('disconnect', () => {
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
                    Main.leaveRoom(leaveRoomBody);
                }
              });
            
            socket.on("join_room" , (data: {roomId: string , username: string }) => {
                if(Main.getRooms().has(data.roomId)) {
                    const currRoom =  Main.getRooms().get(data.roomId);
                    if(currRoom.getPlayers().has(data.username)) {
                        const currPlayer = currRoom.getPlayers().get(data.username);
                        currPlayer.setSocketId(socket.id);
                        socket.join(data.roomId);
                        console.log(`User ${data.username} joind to room: ${data.roomId}`);
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

            socket.on("send_message" , (data) => {
                socket.to(data.room).emit("recieve_message" , data);
            });

        })
    }

    private sendPrivateMessage = (clientID: string , message: any) => {
        this.ioServer.to(clientID).emit("recieve_message" , message);
    }

    private sendGameMessage = (roomId: string , message: any) => {
        console.log(roomId , message);
        this.ioServer.to(roomId).emit("recieve_message" , message);
    }

    private leaveClient = async(roomId:string , socketId: string) => {
        const sockets = await this.ioServer.in(roomId).fetchSockets();
        sockets.forEach(socket => {
            if(socket.id === socketId) {
                socket.leave(roomId);
                SocketServer.sendPrivateMessage(socketId , `BYE BYE FROM ROOM ${roomId}`);

            }
        })
    }
    
    public static init = SocketServer.instance.init;
    public static sendPrivateMessage = SocketServer.instance.sendPrivateMessage;
    public static sendGameMessage = SocketServer.instance.sendGameMessage;
    public static leaveClient = SocketServer.instance.leaveClient;

}

