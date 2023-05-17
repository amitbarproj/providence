"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providence = void 0;
const enums_1 = require("../../../../../../classes/enums");
const socketEnums_1 = require("../../../../../../classes/socketEnums");
const socketServer_1 = require("../../socketServer");
const providenceConf = require("../../../../../../../../../config/Games/providence.json");
class Providence {
    constructor(players, roomId) {
        this.roomId = undefined;
        this.players = undefined;
        this.minPlayers = providenceConf.minPlayers;
        this.myIterator = undefined;
        this.currentPlayer = undefined;
        this.currPlayerInterval = undefined;
        this.allPlayersInterval = undefined;
        this.currWord = undefined;
        this.gameState = undefined;
        this.maxPoints = providenceConf.maxPoints;
        this.isGameStarted = false;
        this.gameInfo = providenceConf.gameInfo || undefined;
        this.gameStats = [];
        this.startGame = () => {
            this.isGameStarted = true;
            socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_ENUMS.START_GAME, `Game Providence in room ${this.roomId} started right now`);
            this.startNewRound();
        };
        this.startNewRound = () => {
            this.players.forEach((player) => {
                player.getGameData().currWord = undefined;
                player.getGameData().winThisRound = false;
            });
            this.clearAllIntervals();
            socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_PLAYER_CLOCK, "");
            socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_ALL_CLOCK, "");
            this.currWord = undefined;
            this.setNextPlayer();
            this.startCurrPlayerClock();
        };
        this.setNextPlayer = () => {
            this.currentPlayer = this.myIterator.next();
            if (this.currentPlayer.done) {
                this.myIterator = this.players.entries();
                this.currentPlayer = this.myIterator.next();
            }
            if (this.currentPlayer.value) {
                this.players.forEach((player) => {
                    const bla = player.getGameData();
                    bla.myTurn = false;
                });
                this.currentPlayer.value[1].getGameData().myTurn = true;
                socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.NEW_PLAYER_TURN, {
                    players: this.getNewPlayersStateSocket(),
                });
            }
            else {
                this.clearAllIntervals();
            }
        };
        this.getNewPlayersStateSocket = () => {
            const ans = [];
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
        this.calculateRound = () => {
            const objStatsToPush = [];
            const helperWordsArr = [];
            this.updateGameStateAndSendToClients(enums_1.PROVIDENCE_GAME_STATE.CALCULATE_ROUND);
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
            const bestWords = [];
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
                    else {
                        objStatsToPush.push({
                            username: player.getUserName(),
                            winThisRound: false,
                            word: player.getGameData().currWord,
                        });
                    }
                });
                if (player.getGameData().winThisRound) {
                    player.getGameData().points++;
                    numOfWinnersInRound++;
                    objStatsToPush.push({
                        username: player.getUserName(),
                        winThisRound: true,
                        word: player.getGameData().currWord,
                    });
                }
                else {
                    objStatsToPush.push({
                        username: player.getUserName(),
                        winThisRound: false,
                        word: player.getGameData().currWord,
                    });
                }
            });
            if (numOfWinnersInRound === this.players.size) {
                this.players.forEach((player) => {
                    player.getGameData().points--;
                });
            }
            this.gameStats.push(objStatsToPush);
            console.log(this.gameStats);
            this.updatePlayersToUI(this.gameStats);
        };
        this.startCurrPlayerClock = () => {
            this.updateGameStateAndSendToClients(enums_1.PROVIDENCE_GAME_STATE.PLAYER_CLOCK);
            clearInterval(this.allPlayersInterval);
            let counter = providenceConf.currPlayerClockSec;
            this.currPlayerInterval = setInterval(() => {
                socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_PLAYER_CLOCK, counter);
                counter -= 1;
                if (counter < 0 || !this.currentPlayer.value[1].Connected()) {
                    this.startNewRound();
                }
            }, 1000);
        };
        this.startAllPlayersClock = () => {
            this.updateGameStateAndSendToClients(enums_1.PROVIDENCE_GAME_STATE.ALL_CLOCK);
            clearInterval(this.allPlayersInterval);
            let counter = providenceConf.allPlayersClockSec;
            this.allPlayersInterval = setInterval(() => {
                socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_ALL_CLOCK, {
                    counter: counter,
                    players: this.getNewPlayersStateSocket(),
                });
                counter -= 1;
                if (counter < 0 || this.allPlayersVoted()) {
                    clearInterval(this.allPlayersInterval);
                    socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_ALL_CLOCK, "");
                    //caluclate results....
                    this.calculateRound();
                    console.log(`Main word is ${this.currWord}`);
                    this.players.forEach((player) => {
                        console.log(`Username: ${player.getUserName()}, Word: ${player.getGameData().currWord}`);
                    });
                    if (this.isAWinner()) {
                        setTimeout(() => {
                            this.endGame();
                        }, providenceConf.calculateRoundClockSec * 1000);
                    }
                    else {
                        setTimeout(() => {
                            this.startNewRound();
                        }, providenceConf.calculateRoundClockSec * 1000);
                    }
                }
            }, 1000);
        };
        this.updateGameStateAndSendToClients = (newState) => {
            this.gameState = newState;
            let data = undefined;
            switch (newState) {
                case enums_1.PROVIDENCE_GAME_STATE.PLAYER_CLOCK:
                    break;
                case enums_1.PROVIDENCE_GAME_STATE.ALL_CLOCK:
                    data = { currWord: this.currWord };
                    break;
                case enums_1.PROVIDENCE_GAME_STATE.CALCULATE_ROUND:
                    break;
                case enums_1.PROVIDENCE_GAME_STATE.END_OF_GAME:
                    break;
            }
            socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_GAME_STATE, {
                newState: newState,
                data: data,
            });
        };
        this.isAWinner = () => {
            let ans = false;
            this.players.forEach((player) => {
                if (player.getGameData().points >= this.maxPoints) {
                    ans = true;
                    player.getGameData().winner = true;
                }
            });
            return ans;
        };
        this.allPlayersVoted = () => {
            let ans = true;
            this.players.forEach((player) => {
                if (!player.getGameData().currWord && player.Connected()) {
                    ans = false;
                }
            });
            return ans;
        };
        this.getGameState = () => {
            return {
                gameState: this.gameState,
                currWord: this.currWord,
                stats: this.gameStats,
            };
        };
        this.getGameConfig = () => {
            return {
                maxPoints: providenceConf.maxPoints,
                minPlayers: providenceConf.minPlayers,
                allPlayersClockSec: providenceConf.allPlayersClockSec,
                currPlayerClockSec: providenceConf.currPlayerClockSec,
            };
        };
        this.getGameInfo = () => {
            return this.gameInfo;
        };
        this.getMinPlayers = () => {
            return this.minPlayers;
        };
        this.clearAllIntervals = () => {
            clearInterval(this.currPlayerInterval);
            clearInterval(this.allPlayersInterval);
        };
        this.updatePlayersToUI = (stats) => {
            socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_PLAYERS, {
                players: this.getNewPlayersStateSocket(),
                stats: stats || undefined,
            });
        };
        this.endGame = () => {
            this.clearAllIntervals();
            this.updateGameStateAndSendToClients(enums_1.PROVIDENCE_GAME_STATE.END_OF_GAME);
            this.updatePlayersToUI();
        };
        this.GameStarted = () => {
            return this.isGameStarted;
        };
        this.startNewGame = () => {
            this.players.forEach((player) => {
                player.setGameData({
                    myTurn: false,
                    points: 0,
                    currWord: undefined,
                    winThisRound: false,
                    winner: false,
                });
            });
            this.myIterator = this.players.entries();
            this.currentPlayer = this.myIterator.next();
            this.currWord = undefined;
            this.gameState = undefined;
            this.startGame();
        };
        this.socketFromUsers = (msg) => {
            if (msg.data.type === socketEnums_1.PROVIDENCE_SOCKET_GAME.SEND_PLAYER_WORD) {
                if (!this.players.get(msg.username).getGameData().currWord) {
                    this.players.get(msg.username).getGameData().currWord =
                        msg.data.content === "" ||
                            !msg.data.content ||
                            msg.data.content.length > providenceConf.playerWordMaxLength
                            ? undefined
                            : msg.data.content.trim();
                    this.updatePlayersToUI();
                    console.log(`${msg.username} VOTEDDDDD ${msg.data.content}`);
                }
                else {
                    console.log(`${msg.username} already voted`);
                }
            }
            else if (msg.data.type === socketEnums_1.PROVIDENCE_SOCKET_GAME.SEND_MAIN_WORD) {
                if (!this.currWord) {
                    if (msg.data.content === "" ||
                        !msg.data.content ||
                        msg.data.content.length > providenceConf.mainWordMaxLength) {
                        this.startNewRound();
                    }
                    else {
                        this.currWord = msg.data.content;
                        console.log(msg.username, msg.data.content);
                        clearInterval(this.currPlayerInterval);
                        socketServer_1.SocketServer.sendRoomMessage(this.roomId, socketEnums_1.SOCKET_GAME.UPDATE_PLAYER_CLOCK, "");
                        this.startAllPlayersClock();
                    }
                }
            }
            else if (msg.data.type === socketEnums_1.PROVIDENCE_SOCKET_GAME.START_NEW_GAME) {
                this.startNewGame();
            }
        };
        this.players = players;
        this.myIterator = this.players.entries();
        this.currentPlayer = this.myIterator.next();
        this.roomId = roomId;
    }
}
exports.Providence = Providence;
//# sourceMappingURL=Providence.js.map