// import e = require("cors");

import { PROVIDENCE_SOCKET_GAME, SOCKET_ENUMS, SOCKET_GAME } from "../../../../../classes/socketEnums";
import {
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
  private currPlayerInterval = undefined;

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
    this.startNewRound();
    // setInterval(() => {
    //   this.setNextPlayer();
    // }, 3000);
  }

  private startNewRound = () => {
    this.setNextPlayer();
    this.startCurrPlayerClock();
  };

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
      });
      this.currentPlayer.value[1].getGameData().myTurn = true;
      SocketServer.sendRoomMessage(this.roomId, SOCKET_GAME.NEW_PLAYER_TURN, {
        players: this.getNewPlayersStateSocket(),
      });
    } else {
        clearInterval(this.currPlayerInterval);
    }
  };

  private getNewPlayersStateSocket = () => {
    const ans: PLAYER_SOCKET_DATA<PROVIDENCE_PLAYER_DATA>[] = [];
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


  private startCurrPlayerClock = () => {
    let counter = 10;
    this.currPlayerInterval = setInterval(() => {
      SocketServer.sendRoomMessage(
        this.roomId,
        SOCKET_GAME.UPDATE_CLOCK,
        counter
      );
      counter -= 1;
      if (counter < 0) {
        console.log("Done");
        clearInterval(this.currPlayerInterval);
        this.startNewRound();
      }
    }, 1000);
  };

  public socketFromUsers = (msg: { username: string, data: {type: string, content: any} }) => {
    // console.log(msg);
    if(msg.data.type ===  PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD) {
        console.log(msg.username , msg.data.content);
    }
    else if(msg.data.type ===  PROVIDENCE_SOCKET_GAME.SEND_MAIN_WORD) {
        console.log(msg.username , msg.data.content);
    }
  };
}

