import { GAMES } from "../../../../classes/enums";
import { SOCKET_ENUMS } from "../../../../classes/socketEnums";
import {
  ASYNC_RESPONSE,
  CREATE_ROOM_BODY,
  JOIN_ROOM_BODY,
  JOIN_ROOM_RES,
  LEAVE_ROOM_BODY,
  PLAYER_SOCKET_DATA,
  SOCKET_JOIN_ROOM_OBJ,
  START_GAME_RES,
} from "../../../../classes/types";
import { Providence } from "./Games/Providence";
import { Game } from "./game";
import { User } from "./player";
import { SocketServer } from "./socketServer";

const gameConf = require("../../../../../../../config/gameConf.json");

export class Room {
  private roomId: string = undefined;
  private secret: string = undefined;
  private auth: boolean = undefined;
  private description: string = undefined;
  private players: Map<string, User> = new Map<string, User>();
  private maxPlayers: number = undefined;
  private minPlayers: number = undefined;
  private gameType: GAMES = undefined;
  private game: Game = undefined;

  constructor(createRoomBody: CREATE_ROOM_BODY) {
    this.roomId = createRoomBody.roomId;
    this.auth = createRoomBody.auth;
    this.secret = createRoomBody.secret;
    this.gameType = createRoomBody.game;
    this.description = createRoomBody.description || "";
    this.maxPlayers = createRoomBody.maxPlayers || gameConf.maxPlayers;
    this.minPlayers = createRoomBody.minPlayers || gameConf.minPlayers;
    this.players.set(
      createRoomBody.username,
      new User(createRoomBody.username, true, this.gameType)
    );
  }

  public joinRoom = (joinRoomBody: JOIN_ROOM_BODY) => {
    this.players.set(
      joinRoomBody.username,
      new User(
        joinRoomBody.username,
        this.getNumOfPlayers() === 0 ? true : false,
        this.gameType
      )
    );
  };

  public leaveRoom = async (leaveRoomBody: LEAVE_ROOM_BODY) => {
    const deletedPlayer: User = this.players.get(leaveRoomBody.username);
    if (deletedPlayer.isAdmin()) {
      if (this.getNumOfPlayers() > 1) {
        const newAdminPlayer: User = this.getFirstNonAdminPlayer();
        newAdminPlayer.setIsAdmin(true);
        SocketServer.sendPrivateMessage(
          newAdminPlayer.getSocketId(),
          SOCKET_ENUMS.YOU_ARE_NEW_ADMIN,
          SOCKET_ENUMS.YOU_ARE_NEW_ADMIN
        );
      }
    }
    this.players.delete(leaveRoomBody.username);
    if (deletedPlayer.getSocketId()) {
      await SocketServer.leaveClient(this.roomId, deletedPlayer.getSocketId());
    }
  };

  public getPlayers = (): Map<string, User> => {
    return this.players;
  };

  public getPlayersUsername = (): string[] => {
    const ans = [];
    this.players.forEach((player) => {
      ans.push(player.getUserName());
    });
    return ans;
  };

  public startGame = () => {
    switch (this.gameType) {
      case GAMES.Providence:
        this.game = new Providence(this.players, this.roomId, this.minPlayers);
        break;
      default:
        throw new Error("Game type not exist");
    }
  };
  public getGame = (): Game => {
   return this.game;
  };

  public gameStarted = (): boolean => {
    return this.game ? true : false;
  };

  public getSecret = (): string => {
    return this.secret;
  };

  public needAuth = (): boolean => {
    return this.auth;
  };

  public getNumOfPlayers = (): number => {
    return this.players.size;
  };

  public getRoomId = (): string => {
    return this.roomId;
  };

  public getMaxPlayers = (): number => {
    return this.maxPlayers;
  };

  public getMinPlayers = (): number => {
    return this.minPlayers;
  };

  public getDescription = (): string => {
    return this.description;
  };

  public getGameType = (): GAMES => {
    return this.gameType;
  };

  public getPlayersSocketData = (): PLAYER_SOCKET_DATA<any>[] => {
    const ans: PLAYER_SOCKET_DATA<any>[] = [];
    this.players.forEach((player) => {
      ans.push({
          username: player.getUserName(),
          isAdmin: player.isAdmin(),
          isConnected: player.Connected(),
          imgURL: player.getImgURL(),
          gameData: player.getGameData()
      });
    });
    return ans;
  };

  private getFirstNonAdminPlayer = (): User => {
    let ans: User = undefined;
    this.players.forEach((player) => {
      if (!player.isAdmin()) {
        ans = player;
      }
    });
    return ans;
  };
}
