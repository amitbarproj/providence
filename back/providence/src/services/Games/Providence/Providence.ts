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
  private isGameStarted = false;
  private gameInfo = providenceConf.gameInfo || undefined;

  constructor(players: Map<string, User>, roomId: string) {
    this.players = players;
    this.myIterator = this.players.entries();
    this.currentPlayer = this.myIterator.next();
    this.roomId = roomId;
    // SocketServer.sendRoomMessage(
    //   this.roomId,
    //   SOCKET_ENUMS.START_GAME,
    //   `Game Providence in room ${roomId} started right now`
    // );
    // this.startNewRound();
  }

  public startGame = () => {
    this.isGameStarted = true;
    SocketServer.sendRoomMessage(
      this.roomId,
      SOCKET_ENUMS.START_GAME,
      `Game Providence in room ${this.roomId} started right now`
    );
    this.startNewRound();
  };

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
    const helperWordsArr: { word: string; count: number }[] = [];
    this.updateGameStateAndSendToClients(PROVIDENCE_GAME_STATE.CALCULATE_ROUND);
    this.players.forEach((player) => {
      const currPlayerWord = player.getGameData().currWord;
      if (currPlayerWord) {
        let wordExist = false;
        helperWordsArr.forEach((wordObj) => {
          if (wordObj.word === currPlayerWord) {
            wordObj.count++;
            wordExist = true;
          }
        });
        if (!wordExist) {
          helperWordsArr.push({ word: currPlayerWord, count: 1 });
        }
      }
    });
    const bestWords: string[] = [];
    let maxCounts = -Infinity;
    helperWordsArr.forEach((word) => {
      if (word.count > maxCounts && word.count > 1) {
        maxCounts = word.count;
      }
    });
    helperWordsArr.forEach((word) => {
      if (word.count === maxCounts) {
        bestWords.push(word.word);
      }
    });
    let numOfWinnersInRound = 0;
    this.players.forEach((player) => {
      bestWords.forEach((word) => {
        if (player.getGameData().currWord === word) {
          player.getGameData().winThisRound = true;
        }
      });
      if (player.getGameData().winThisRound) {
        player.getGameData().points++;
        numOfWinnersInRound++;
      }
    });
    if (numOfWinnersInRound === this.players.size) {
      this.players.forEach((player) => {
        player.getGameData().points--;
      });
    }
    this.updatePlayersToUI();
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
      if (counter < 0 || !this.currentPlayer.value[1].Connected()) {
        this.startNewRound();
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
        if (this.isAWinner()) {
          setTimeout(() => {
            this.endGame();
          }, providenceConf.calculateRoundClockSec * 1000);
        } else {
          setTimeout(() => {
            this.startNewRound();
          }, providenceConf.calculateRoundClockSec * 1000);
        }
      }
    }, 1000);
  };

  private updateGameStateAndSendToClients = (
    newState: PROVIDENCE_GAME_STATE
  ) => {
    this.gameState = newState;
    let data = undefined;
    switch (newState) {
      case PROVIDENCE_GAME_STATE.PLAYER_CLOCK:
        break;
      case PROVIDENCE_GAME_STATE.ALL_CLOCK:
        data = { currWord: this.currWord };
        break;
      case PROVIDENCE_GAME_STATE.CALCULATE_ROUND:
        break;
      case PROVIDENCE_GAME_STATE.END_OF_GAME:
        break;
    }
    SocketServer.sendRoomMessage(this.roomId, SOCKET_GAME.UPDATE_GAME_STATE, {
      newState: newState,
      data: data,
    });
  };

  private isAWinner = (): boolean => {
    let ans = false;
    this.players.forEach((player) => {
      if (player.getGameData().points >= this.maxPoints) {
        ans = true;
        player.getGameData().winner = true;
      }
    });
    return ans;
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
    return {
      gameState: this.gameState,
      currWord: this.currWord,
    };
  };

  public getGameInfo = () => {
    return this.gameInfo;
  };

  public getMinPlayers = (): number => {
    return this.minPlayers;
  };

  private clearAllIntervals = () => {
    clearInterval(this.currPlayerInterval);
    clearInterval(this.allPlayersInterval);
  };

  private updatePlayersToUI = () => {
    SocketServer.sendRoomMessage(this.roomId, SOCKET_GAME.UPDATE_PLAYERS, {
      players: this.getNewPlayersStateSocket(),
    });
  };

  public endGame = () => {
    this.clearAllIntervals();
    this.updateGameStateAndSendToClients(PROVIDENCE_GAME_STATE.END_OF_GAME);
    this.updatePlayersToUI();
    //NEED TO ANOUNCMENT THE WINNER!!!! if game not ended
  };

  public GameStarted = (): boolean => {
    return this.isGameStarted;
  };

  public socketFromUsers = (msg: {
    username: string;
    data: { type: string; content: any };
  }) => {
    // console.log(msg);
    if (msg.data.type === PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD) {
      if (!this.players.get(msg.username).getGameData().currWord) {
        this.players.get(msg.username).getGameData().currWord =
          msg.data.content === "" ||
          !msg.data.content ||
          msg.data.content.length > providenceConf.playerWordMaxLength
            ? undefined
            : msg.data.content.trim();
        this.updatePlayersToUI();
        console.log(`${msg.username} VOTEDDDDD ${msg.data.content}`);
      } else {
        console.log(`${msg.username} already voted`);
      }
    } else if (msg.data.type === PROVIDENCE_SOCKET_GAME.SEND_MAIN_WORD) {
      if (!this.currWord) {
        if (
          msg.data.content === "" ||
          !msg.data.content ||
          msg.data.content.length > providenceConf.mainWordMaxLength
        ) {
          this.startNewRound();
        } else {
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
    }
  };
}
