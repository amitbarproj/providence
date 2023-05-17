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
exports.Room = void 0;
const enums_1 = require("../../../../classes/enums");
const socketEnums_1 = require("../../../../classes/socketEnums");
const Providence_1 = require("./Games/Providence/Providence");
const player_1 = require("./player");
const socketServer_1 = require("./socketServer");
class Room {
    constructor(createRoomBody) {
        this.roomId = undefined;
        this.secret = undefined;
        this.auth = undefined;
        this.description = undefined;
        this.players = new Map();
        this.maxPlayers = undefined;
        this.gameType = undefined;
        this.game = undefined;
        this.openGame = () => {
            switch (this.gameType) {
                case enums_1.GAMES.Providence:
                    this.game = new Providence_1.Providence(this.players, this.roomId);
                    break;
                default:
                    throw new Error("Game type not exist");
            }
        };
        this.joinRoom = (joinRoomBody) => {
            this.players.set(joinRoomBody.username, new player_1.User(joinRoomBody.username, this.getNumOfPlayers() === 0 ? true : false, this.gameType));
        };
        this.leaveRoom = (leaveRoomBody) => __awaiter(this, void 0, void 0, function* () {
            const deletedPlayer = this.players.get(leaveRoomBody.username);
            if (deletedPlayer.isAdmin()) {
                if (this.getNumOfPlayers() > 1) {
                    const newAdminPlayer = this.getFirstNonAdminPlayer();
                    newAdminPlayer.setIsAdmin(true);
                    socketServer_1.SocketServer.sendPrivateMessage(newAdminPlayer.getSocketId(), socketEnums_1.SOCKET_ENUMS.YOU_ARE_NEW_ADMIN, socketEnums_1.SOCKET_ENUMS.YOU_ARE_NEW_ADMIN);
                }
            }
            this.players.delete(leaveRoomBody.username);
            if (deletedPlayer.getSocketId()) {
                yield socketServer_1.SocketServer.leaveClient(this.roomId, deletedPlayer.getSocketId());
            }
        });
        this.getPlayers = () => {
            return this.players;
        };
        this.getPlayersUsername = () => {
            const ans = [];
            this.players.forEach((player) => {
                ans.push(player.getUserName());
            });
            return ans;
        };
        this.startGame = () => {
            // switch (this.gameType) {
            //   case GAMES.Providence:
            //     this.game = new Providence(this.players, this.roomId);
            //     break;
            //   default:
            //     throw new Error("Game type not exist");
            // }
            this.game.startGame();
        };
        this.getGame = () => {
            return this.game;
        };
        this.gameStarted = () => {
            return this.game.GameStarted();
        };
        this.getSecret = () => {
            return this.secret;
        };
        this.needAuth = () => {
            return this.auth;
        };
        this.getNumOfPlayers = () => {
            return this.players.size;
        };
        this.getGameInfo = () => {
            return this.game.getGameInfo();
        };
        this.getRoomId = () => {
            return this.roomId;
        };
        this.getMaxPlayers = () => {
            return this.maxPlayers;
        };
        this.getDescription = () => {
            return this.description;
        };
        this.getGameType = () => {
            return this.gameType;
        };
        this.getGameConfig = () => {
            return this.game.getGameConfig();
        };
        this.getPlayersSocketData = () => {
            const ans = [];
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
        this.deleteRoom = () => {
            if (this.game) {
                this.game.endGame();
            }
        };
        this.getFirstNonAdminPlayer = () => {
            let ans = undefined;
            this.players.forEach((player) => {
                if (!player.isAdmin()) {
                    ans = player;
                }
            });
            return ans;
        };
        this.roomId = createRoomBody.roomId;
        this.auth = createRoomBody.auth;
        this.secret = createRoomBody.secret;
        this.gameType = createRoomBody.game;
        this.description = createRoomBody.description || "";
        this.maxPlayers = createRoomBody.maxPlayers;
        this.players.set(createRoomBody.username, new player_1.User(createRoomBody.username, true, this.gameType));
        this.openGame();
    }
}
exports.Room = Room;
//# sourceMappingURL=room.js.map