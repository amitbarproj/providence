import { LEAVE_ROOM_BODY } from "../../../../classes/types";
import { Main } from "./main";
import { Player } from "./player";

const { Server } = require("socket.io");


export class SocketServer {
    private static instance: SocketServer = new SocketServer();

    private ioServer;


    constructor() {

    }

    private init = (server) => {
        console.log("init Socket-Server....");
        this.ioServer = new Server(server, {
            cors: {
                origin: "http://localhost:3000", // TODO: need to config and check what to put here
                methods: ["GET","POST"]
            }
        });

        setInterval(() => {
            this.ioServer.to("111").emit("recieve_message" , "HEY!");
        } , 1000)
        
        this.ioServer.on("connection" , (socket) => {
            console.log(`User Connected: ${socket.id}`);

            socket.on('disconnect', () => {
                let leaveRoomBody: LEAVE_ROOM_BODY = undefined;
                console.log(`user disconnected ${socket.id}`);
                Main.getRooms().forEach(room => {
                    room.getPlayers().forEach(player => {
                        if(player.getSocketInstance().id === socket.id) {
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
                        currPlayer.setSocketInstance(socket);
                        socket.join(data.roomId);
                        console.log(`User ${data.username} joind to room: ${data.roomId}`);
                    }
                    else{
                        console.log(`User ${data.username} Not exist`);
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
    
    public static init = SocketServer.instance.init;

}

