// import e = require("cors");

import { PROVIDENCE_GAME_STATE } from "../../../../../classes/enums";
import {
  PROVIDENCE_SOCKET_GAME,
  SOCKET_ENUMS,
  SOCKET_GAME,
} from "../../../../../classes/socketEnums";
import {
  PLAYER_SOCKET_DATA,
  PROVIDENCE_GAME_INFO,
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
  private allPlayersInterval = undefined;
  private currWord = undefined;
  private gameState = undefined;
  private maxPoints = 3;

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
    this.players.forEach((player) => {
      player.getGameData().currWord = undefined;
      player.getGameData().winThisRound = false;
    });
    clearInterval(this.currPlayerInterval);
    clearInterval(this.allPlayersInterval);
    SocketServer.sendRoomMessage(
      this.roomId,
      SOCKET_GAME.UPDATE_PLAYER_CLOCK,
      ""
    );
    SocketServer.sendRoomMessage(this.roomId, SOCKET_GAME.UPDATE_ALL_CLOCK, "");
    this.currWord = undefined;
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
      clearInterval(this.allPlayersInterval);
    }
  };

  // public getAllGameInfo = (): PROVIDENCE_GAME_INFO => {
  //   const ans: PROVIDENCE_GAME_INFO = {players: [] , gameState: this.gameState};
  //   this.players.forEach((player) => {
  //     ans.players.push({
  //       username: player.getUserName(),
  //       isAdmin: player.isAdmin(),
  //       isConnected: player.Connected(),
  //       imgURL: player.getImgURL(),
  //       gameData: player.getGameData(),
  //     });
  //   });
  //   return ans;
  // };

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

  private calculateRound = () => {
    this.updateGameStateAndSendToClients(PROVIDENCE_GAME_STATE.CALCULATE_ROUND);
    this.players.forEach((player) => {
      const playerWord = player.getGameData().currWord;
      player.getGameData().points++;
      player.getGameData().winThisRound = true;
    });
    SocketServer.sendRoomMessage(this.roomId, SOCKET_GAME.UPDATE_PLAYERS, {
      players: this.getNewPlayersStateSocket(),
    });
  };

  private startCurrPlayerClock = () => {
    this.updateGameStateAndSendToClients(PROVIDENCE_GAME_STATE.PLAYER_CLOCK);
    clearInterval(this.allPlayersInterval);
    let counter = 5;
    this.currPlayerInterval = setInterval(() => {
      SocketServer.sendRoomMessage(
        this.roomId,
        SOCKET_GAME.UPDATE_PLAYER_CLOCK,
        counter
      );
      counter -= 1;
      if (counter < 0) {
        this.currWord = "BLAAAAA";
        clearInterval(this.currPlayerInterval);
        SocketServer.sendRoomMessage(
          this.roomId,
          SOCKET_GAME.UPDATE_PLAYER_CLOCK,
          ""
        );
        this.startAllPlayersClock();
      }
    }, 1000);
  };

  private startAllPlayersClock = () => {
    console.log(this.currWord);
    clearInterval(this.allPlayersInterval);
    this.updateGameStateAndSendToClients(PROVIDENCE_GAME_STATE.ALL_CLOCK);
    let counter = 10;
    this.allPlayersInterval = setInterval(() => {
      SocketServer.sendRoomMessage(
        this.roomId,
        SOCKET_GAME.UPDATE_ALL_CLOCK,
        {counter: counter,
          players: this.getNewPlayersStateSocket(),
        }
      );
      counter -= 1;
      if (counter < 0) {
        clearInterval(this.allPlayersInterval);
        SocketServer.sendRoomMessage(
          this.roomId,
          SOCKET_GAME.UPDATE_ALL_CLOCK,
          ""
        );
        //caluclate results....
        this.calculateRound();
        console.log(`Main word is ${this.currWord}`);
        this.players.forEach((player) => {
          console.log(
            `Username: ${player.getUserName()}, Word: ${
              player.getGameData().currWord
            }`
          );
        });
        setTimeout(() => {
          this.startNewRound();
        }, 3000);
      }
    }, 1000);
  };

  private updateGameStateAndSendToClients = (newState: PROVIDENCE_GAME_STATE) => {
      this.gameState = newState;
      SocketServer.sendRoomMessage(
        this.roomId,
        SOCKET_GAME.UPDATE_GAME_STATE,
        newState
      );
  };

  public getGameState = () => {
   return this.gameState;
};

  public socketFromUsers = (msg: {
    username: string;
    data: { type: string; content: any };
  }) => {
    // console.log(msg);
    if (msg.data.type === PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD) {
      if(!this.players.get(msg.username).getGameData().currWord){
        this.players.get(msg.username).getGameData().currWord = msg.data.content;
        console.log(`${msg.username} VOTEDDDDD ${msg.data.content}`);
      }
      else{
        console.log(`${msg.username} already voted`);
      }
    } else if (msg.data.type === PROVIDENCE_SOCKET_GAME.SEND_MAIN_WORD) {
      if (!this.currWord) {
        this.currWord = msg.data.content;
        console.log(msg.username, msg.data.content);
        clearInterval(this.currPlayerInterval);
        SocketServer.sendRoomMessage(
          this.roomId,
          SOCKET_GAME.UPDATE_PLAYER_CLOCK,
          ""
        );
        this.startAllPlayersClock();
      }
    }
    // else if (msg.data.type === PROVIDENCE_SOCKET_GAME.GET_GAME_INFO) {
     
    // }
    
  };
}
