import { Socket } from "socket.io";
import { AvatarGenerator } from "random-avatar-generator";
import { GAMES } from "../../../../classes/enums";
import { Main } from "./main";
const gameConf = require("../../../../../../../config/gameConf.json");

const generator = new AvatarGenerator();

// Simply get a random avatar

export class User {
  private username: string;
  private admin: boolean;
  private isConnected: boolean;
  private socketId: string;
  private imgURL: string = generator.generateRandomAvatar();
  private gameData: any = undefined;
  private connectedTimeout = undefined;
  private roomId: string = undefined;

  constructor(username: string, isAdmin: boolean, gameType: GAMES, roomId: string) {
    this.username = username;
    this.admin = isAdmin;
    this.roomId = roomId;
    // this.points = 0;
    this.isConnected = true;
    // this.myTurn = false;
    switch (gameType) {
      case GAMES.Providence:
        this.gameData = {
          myTurn: false,
          points: 0,
          currWord: undefined,
          winThisRound: false,
          winner: false,
        };
    }
  }

  public isAdmin = (): boolean => {
    return this.admin;
  };

  public setIsAdmin = (isAdmin: boolean) => {
    this.admin = isAdmin;
  };

  public getUserName = (): string => {
    return this.username;
  };

  public getSocketId = (): string => {
    return this.socketId;
  };

  public setSocketId = (socketId: string) => {
    this.socketId = socketId;
  };

  public Connected = (): boolean => {
    return this.isConnected;
  };

  public setConnected = (newConnected: boolean) => {
    this.isConnected = newConnected;
    if (newConnected === true) {
      clearTimeout(this.connectedTimeout);
    } else {
      this.connectedTimeout = setTimeout(() => {
        // export type LEAVE_ROOM_BODY = {
        //   roomId: string;
        //   username: string;
        // };
        Main.leaveRoom({roomId: this.roomId , username: this.username});
        // const newPlayers = {
        //   players: room.getPlayersSocketData(),
        // };
        // SocketServer.sendRoomMessage(
        //   room.getRoomId(),
        //   SOCKET_ENUMS.UPDATE_PLAYERS_STATE,
        //   newPlayers
        // );
      }, gameConf.disconnectedUserTimeout);
    }
  };

  public getImgURL = (): string => {
    return this.imgURL;
  };

  public getGameData = (): any => {
    return this.gameData;
  };
  public setGameData = (newGameData) => {
    this.gameData = newGameData;
  };
}
