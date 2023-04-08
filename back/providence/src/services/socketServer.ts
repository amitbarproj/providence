import { Main } from "./main";

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
        
        this.ioServer.on("connection" , (socket) => {
            console.log(`User Connected: ${socket.id}`);
            
            socket.on("join_room" , (roomId) => {
                socket.join(roomId);
                console.log(`User ${socket.id} joind to room: ${roomId}`);
            })

            socket.on("send_message" , (data) => {
                socket.to(data.room).emit("recieve_message" , data);
            });

        })
    }
    
    public static init = SocketServer.instance.init;

}

