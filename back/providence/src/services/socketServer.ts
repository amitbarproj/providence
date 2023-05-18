import { SOCKET_ENUMS } from "../../../../classes/socketEnums";
import {
  LEAVE_ROOM_BODY,
  SOCKET_JOIN_ROOM_OBJ,
} from "../../../../classes/types";
import { Main } from "./main";
import { User } from "./player";

const { Server } = require("socket.io");
const servConf = require("../../../../../../../config/services.json");

export class SocketServer {
  private static instance: SocketServer = new SocketServer();

  private ioServer;

  constructor() {}

  private init = (server) => {
    console.log("init Socket-Server....");
    this.ioServer = new Server(server, {
      cors: {
        origin: '*'
      },
    });

    this.ioServer.on("connection", (socket) => {
      console.log(`User Connected: ${socket.id}`);

      socket.on("disconnect", async () => {
        let leaveRoomBody: LEAVE_ROOM_BODY = undefined;
        console.log(`user disconnected ${socket.id}`);
        Main.getRooms().forEach((room) => {
          room.getPlayers().forEach((player) => {
            if (player.getSocketId() === socket.id) {
              player.setConnected(false);
              const newPlayers = {
                players: room.getPlayersSocketData(),
              };
              SocketServer.sendRoomMessage(
                room.getRoomId(),
                SOCKET_ENUMS.UPDATE_PLAYERS_STATE,
                newPlayers
              );
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
      });

      socket.on(
        "join_room",
        (data: { roomId: string; username: string }, cb) => {
          console.log(data.roomId);
          if (Main.getRooms().has(data.roomId)) {
            const currRoom = Main.getRooms().get(data.roomId);
            if (currRoom.getPlayers().has(data.username)) {
              const currPlayer = currRoom.getPlayers().get(data.username);
              currPlayer.setSocketId(socket.id);
              socket.join(data.roomId);
              currPlayer.setConnected(true);
              console.log(`${data.username} joind to room: ${data.roomId}`);
              const newPlayersUsernames = {
                players: currRoom.getPlayersSocketData(),
              };
              SocketServer.sendRoomMessage(
                currRoom.getRoomId(),
                SOCKET_ENUMS.UPDATE_PLAYERS_STATE,
                newPlayersUsernames
              );

              const joinRoomObj: SOCKET_JOIN_ROOM_OBJ = {
                players: currRoom.getPlayersSocketData(),
                youAdmin: currPlayer.isAdmin(),
                gameType: currRoom.getGameType(),
                gameInfo: currRoom.getGameInfo(),
                gameStarted: currRoom.gameStarted(),
                gameConfig: currRoom.getGameConfig()
              };
              cb(JSON.stringify(joinRoomObj));
            } else {
              console.log(`Player ${data.username} Not exist`);
              cb(SOCKET_ENUMS.ERROR);
            }
          } else {
            console.log(`Room: ${data.roomId} Not exist`);
            cb(SOCKET_ENUMS.ERROR);
          }
          //check if room exist , and username
          // Main.getRooms().get(data.roomId).getPlayers().get(data.username).setSocketID(socket.id);
        }
      );

      socket.on(
        "game_msg",
        (msg: { roomId: string; username: string; data: any }, cb) => {
          if (Main.getRooms().has(msg.roomId)) {
            const currRoom = Main.getRooms().get(msg.roomId);
            if (currRoom.getGame()) {
              currRoom
                .getGame()
                .socketFromUsers({ username: msg.username, data: msg.data });
              if (msg.data.type === "GET_GAME_INFO") {
                cb(
                  JSON.stringify({
                    gameState: currRoom.getGame().getGameState()
                  })
                );
              }
            }
          } else {
            console.log(`Room: ${msg.roomId} Not exist`);
            cb(SOCKET_ENUMS.ERROR);
          }
          //check if room exist , and username
          // Main.getRooms().get(data.roomId).getPlayers().get(data.username).setSocketID(socket.id);
        }
      );
    });
  };

  private sendPrivateMessage = (
    clientID: string,
    subject: string,
    message: any
  ) => {
    this.ioServer.to(clientID).emit(subject, message);
  };

  private sendRoomMessage = (roomId: string, subject: string, message: any) => {
    this.ioServer.to(roomId).emit(subject, message);
  };

  private leaveClient = async (roomId: string, socketId: string) => {
    const currRoom = Main.getRooms().get(roomId);
    const sockets = await this.ioServer.in(roomId).fetchSockets();
    sockets.forEach((socket) => {
      if (socket.id === socketId) {
        socket.leave(roomId);
        const newPlayersUsernames = {
          players: currRoom.getPlayersSocketData(),
        };
        SocketServer.sendRoomMessage(
          currRoom.getRoomId(),
          SOCKET_ENUMS.UPDATE_PLAYERS_STATE,
          newPlayersUsernames
        );
        SocketServer.sendPrivateMessage(
          socketId,
          SOCKET_ENUMS.ADMIN_DISMISS_YOU,
          `BYE BYE FROM ROOM ${roomId}`
        );
      }
    });
  };

  public static init = SocketServer.instance.init;
  public static sendPrivateMessage = SocketServer.instance.sendPrivateMessage;
  public static sendRoomMessage = SocketServer.instance.sendRoomMessage;
  public static leaveClient = SocketServer.instance.leaveClient;
}
