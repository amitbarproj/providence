"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const socketEnums_1 = require("../../../../classes/socketEnums");
const main_1 = require("./main");
const { Server } = require("socket.io");
const servConf = require("../../../../../../../config/services.json");
class SocketServer {
    constructor() {
        this.init = (server) => {
            console.log("init Socket-Server....");
            this.ioServer = new Server(server, {
                cors: {
                    origin: '*'
                },
            });
            this.ioServer.on("connection", (socket) => {
                console.log(`User Connected: ${socket.id}`);
                socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
                    let leaveRoomBody = undefined;
                    console.log(`user disconnected ${socket.id}`);
                    main_1.Main.getRooms().forEach((room) => {
                        room.getPlayers().forEach((player) => {
                            if (player.getSocketId() === socket.id) {
                                player.setConnected(false);
                                const newPlayers = {
                                    players: room.getPlayersSocketData(),
                                };
                                SocketServer.sendRoomMessage(room.getRoomId(), socketEnums_1.SOCKET_ENUMS.UPDATE_PLAYERS_STATE, newPlayers);
                                leaveRoomBody = {
                                    roomId: room.getRoomId(),
                                    username: player.getUserName(),
                                };
                            }
                        });
                    });
                    if (leaveRoomBody !== undefined) {
                        // await Main.leaveRoom(leaveRoomBody);
                        // const currRoom =  Main.getRooms().get(leaveRoomBody.roomId);
                        // if(currRoom) {
                        //     const newPlayersUsernames = {
                        //         playersUsername: currRoom.getPlayersUsername(),
                        //     }
                        //     SocketServer.sendRoomMessage
                        //     (currRoom.getRoomId(), SOCKET_ENUMS.NEW_PLAYER_LEAVE , newPlayersUsernames );
                        // }
                    }
                }));
                socket.on("join_room", (data, cb) => {
                    console.log(data.roomId);
                    if (main_1.Main.getRooms().has(data.roomId)) {
                        const currRoom = main_1.Main.getRooms().get(data.roomId);
                        if (currRoom.getPlayers().has(data.username)) {
                            const currPlayer = currRoom.getPlayers().get(data.username);
                            currPlayer.setSocketId(socket.id);
                            socket.join(data.roomId);
                            currPlayer.setConnected(true);
                            console.log(`${data.username} joind to room: ${data.roomId}`);
                            const newPlayersUsernames = {
                                players: currRoom.getPlayersSocketData(),
                            };
                            SocketServer.sendRoomMessage(currRoom.getRoomId(), socketEnums_1.SOCKET_ENUMS.UPDATE_PLAYERS_STATE, newPlayersUsernames);
                            const joinRoomObj = {
                                players: currRoom.getPlayersSocketData(),
                                youAdmin: currPlayer.isAdmin(),
                                gameType: currRoom.getGameType(),
                                gameInfo: currRoom.getGameInfo(),
                                gameStarted: currRoom.gameStarted(),
                                gameConfig: currRoom.getGameConfig()
                            };
                            cb(JSON.stringify(joinRoomObj));
                        }
                        else {
                            console.log(`Player ${data.username} Not exist`);
                            cb(socketEnums_1.SOCKET_ENUMS.ERROR);
                        }
                    }
                    else {
                        console.log(`Room: ${data.roomId} Not exist`);
                        cb(socketEnums_1.SOCKET_ENUMS.ERROR);
                    }
                    //check if room exist , and username
                    // Main.getRooms().get(data.roomId).getPlayers().get(data.username).setSocketID(socket.id);
                });
                socket.on("game_msg", (msg, cb) => {
                    if (main_1.Main.getRooms().has(msg.roomId)) {
                        const currRoom = main_1.Main.getRooms().get(msg.roomId);
                        if (currRoom.getGame()) {
                            currRoom
                                .getGame()
                                .socketFromUsers({ username: msg.username, data: msg.data });
                            if (msg.data.type === "GET_GAME_INFO") {
                                cb(JSON.stringify({
                                    gameState: currRoom.getGame().getGameState()
                                }));
                            }
                        }
                    }
                    else {
                        console.log(`Room: ${msg.roomId} Not exist`);
                        cb(socketEnums_1.SOCKET_ENUMS.ERROR);
                    }
                    //check if room exist , and username
                    // Main.getRooms().get(data.roomId).getPlayers().get(data.username).setSocketID(socket.id);
                });
            });
        };
        this.sendPrivateMessage = (clientID, subject, message) => {
            this.ioServer.to(clientID).emit(subject, message);
        };
        this.sendRoomMessage = (roomId, subject, message) => {
            // console.log(subject, message);
            this.ioServer.to(roomId).emit(subject, message);
        };
        this.leaveClient = (roomId, socketId) => __awaiter(this, void 0, void 0, function* () {
            const currRoom = main_1.Main.getRooms().get(roomId);
            const sockets = yield this.ioServer.in(roomId).fetchSockets();
            sockets.forEach((socket) => {
                if (socket.id === socketId) {
                    socket.leave(roomId);
                    const newPlayersUsernames = {
                        players: currRoom.getPlayersSocketData(),
                    };
                    SocketServer.sendRoomMessage(currRoom.getRoomId(), socketEnums_1.SOCKET_ENUMS.UPDATE_PLAYERS_STATE, newPlayersUsernames);
                    SocketServer.sendPrivateMessage(socketId, socketEnums_1.SOCKET_ENUMS.ADMIN_DISMISS_YOU, `BYE BYE FROM ROOM ${roomId}`);
                }
            });
        });
    }
}
SocketServer.instance = new SocketServer();
SocketServer.init = SocketServer.instance.init;
SocketServer.sendPrivateMessage = SocketServer.instance.sendPrivateMessage;
SocketServer.sendRoomMessage = SocketServer.instance.sendRoomMessage;
SocketServer.leaveClient = SocketServer.instance.leaveClient;
exports.SocketServer = SocketServer;
//# sourceMappingURL=socketServer.js.map