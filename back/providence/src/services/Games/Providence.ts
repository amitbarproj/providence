// import e = require("cors");

import { SOCKET_ENUMS, SOCKET_GAME } from "../../../../../classes/socketEnums";
import {
  PLAYER_DATA,
  PLAYER_SOCKET_DATA,
  PROVIDENCE_PLAYER_DATA,
} from "../../../../../classes/types";
import { Game } from "../game";
import { User } from "../player";
import { SocketServer } from "../socketServer";

//Need to do this abstract class
export class Providence implements Game {
  private roomId: string = undefined;
  private players: Map<string, User> = undefined;
  private minPlayers: number = undefined;
  private myIterator = undefined;
  private currentPlayer = undefined;

  constructor(players: Map<string, User>, roomId: string, minPlayers: number) {
    this.players = players;
    this.myIterator = this.players.entries();
    this.currentPlayer = this.myIterator.next();
    this.roomId = roomId;
    this.minPlayers = minPlayers;
    SocketServer.sendRoomMessage(
      this.roomId,
      SOCKET_ENUMS.START_GAME,
      `Game Providence in room ${roomId} started right now`
    );
    setInterval(() => {
      this.setNextPlayer();
    }, 3000);
  }

  private setNextPlayer = () => {
    this.currentPlayer = this.myIterator.next();
    if (this.currentPlayer.done) {
      this.myIterator = this.players.entries();
      this.currentPlayer = this.myIterator.next();
    }
    if (this.currentPlayer.value) {
      this.players.forEach((player) => {
        // player.setMyTurn(false);
        const bla: PROVIDENCE_PLAYER_DATA = player.getGameData();
        bla.myTurn = false;
        bla.points++;
      });
      this.currentPlayer.value[1].getGameData().myTurn = true;
      SocketServer.sendRoomMessage(this.roomId, SOCKET_GAME.NEW_PLAYER_TURN, {
        players: this.getNewPlayersStateSocket(),
      });
    } else {
      //NO PLAYERS IN GAME
    }
  };

  private getNewPlayersStateSocket = () => {
    const ans: PLAYER_SOCKET_DATA[] = [];
    this.players.forEach((player) => {
      ans.push({
        username: player.getUserName(),
        isAdmin: player.isAdmin(),
        isConnected: player.Connected(),
        imgURL: player.getImgURL(),
        gameData: player.getGameData(),
      });
    });
    return ans;
  };
}
