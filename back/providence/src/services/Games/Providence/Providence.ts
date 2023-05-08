import { PROVIDENCE_GAME_STATE } from "../../../../../../classes/enums";
import {
  PROVIDENCE_SOCKET_GAME,
  SOCKET_ENUMS,
  SOCKET_GAME,
} from "../../../../../../classes/socketEnums";
import {
  PLAYER_SOCKET_DATA,
  PROVIDENCE_GAME_INFO,
  PROVIDENCE_PLAYER_DATA,
} from "../../../../../../classes/types";
import { Game } from "../../game";
import { User } from "../../player";
import { SocketServer } from "../../socketServer";

const providenceConf = require("../../../../../../../../../config/Games/providence.json");

export class Providence implements Game {
  private roomId: string = undefined;
  private players: Map<string, User> = undefined;
  private minPlayers: number = providenceConf.minPlayers;
  private myIterator = undefined;
  private currentPlayer = undefined;
  private currPlayerInterval = undefined;
  private allPlayersInterval = undefined;
  private currWord = undefined;
  private gameState = undefined;
  private maxPoints = providenceConf.maxPoints;

  constructor(players: Map<string, User>, roomId: string) {
    this.players = players;
    this.myIterator = this.players.entries();
    this.currentPlayer = this.myIterator.next();
    this.roomId = roomId;
    SocketServer.sendRoomMessage(
      this.roomId,
      SOCKET_ENUMS.START_GAME,
      `Game Providence in room ${roomId} started right now`
    );
    this.startNewRound();
  }

  private startNewRound = () => {
    this.players.forEach((player) => {
      player.getGameData().currWord = undefined;
      player.getGameData().winThisRound = false;
    });
    this.clearAllIntervals();
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
      this.clearAllIntervals();
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
    let counter = providenceConf.currPlayerClockSec;
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
    this.updateGameStateAndSendToClients(PROVIDENCE_GAME_STATE.ALL_CLOCK);
    clearInterval(this.allPlayersInterval);
    let counter = providenceConf.allPlayersClockSec;
    this.allPlayersInterval = setInterval(() => {
      SocketServer.sendRoomMessage(this.roomId, SOCKET_GAME.UPDATE_ALL_CLOCK, {
        counter: counter,
        players: this.getNewPlayersStateSocket(),
      });
      counter -= 1;
      if (counter < 0 || this.allPlayersVoted()) {
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

  private updateGameStateAndSendToClients = (
    newState: PROVIDENCE_GAME_STATE
  ) => {
    this.gameState = newState;
    SocketServer.sendRoomMessage(
      this.roomId,
      SOCKET_GAME.UPDATE_GAME_STATE,
      newState
    );
  };

  private allPlayersVoted = (): boolean => {
    let ans = true;
    this.players.forEach((player) => {
      if (!player.getGameData().currWord && player.Connected()) {
        ans = false;
      }
    });
    return ans;
  };

  public getGameState = () => {
    return this.gameState;
  };

  public getMinPlayers = (): number => {
    return this.minPlayers;
  };

  private clearAllIntervals = () => {
    clearInterval(this.currPlayerInterval);
    clearInterval(this.allPlayersInterval);
  };

  public endGame = () => {
    this.clearAllIntervals();
    this.updateGameStateAndSendToClients(PROVIDENCE_GAME_STATE.END_OF_GAME);
    //NEED TO ANOUNCMENT THE WINNER!!!! if game not ended
  };

  public socketFromUsers = (msg: {
    username: string;
    data: { type: string; content: any };
  }) => {
    // console.log(msg);
    if (msg.data.type === PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD) {
      if (!this.players.get(msg.username).getGameData().currWord) {
        this.players.get(msg.username).getGameData().currWord =
          msg.data.content;
        console.log(`${msg.username} VOTEDDDDD ${msg.data.content}`);
      } else {
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
  };
}
