"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const random_avatar_generator_1 = require("random-avatar-generator");
const enums_1 = require("../../../../classes/enums");
const main_1 = require("./main");
const gameConf = require("../../../../../../../config/gameConf.json");
const generator = new random_avatar_generator_1.AvatarGenerator();
// Simply get a random avatar
class User {
    constructor(username, isAdmin, gameType, roomId) {
        this.imgURL = generator.generateRandomAvatar();
        this.gameData = undefined;
        this.connectedTimeout = undefined;
        this.roomId = undefined;
        this.isAdmin = () => {
            return this.admin;
        };
        this.setIsAdmin = (isAdmin) => {
            this.admin = isAdmin;
        };
        this.getUserName = () => {
            return this.username;
        };
        this.getSocketId = () => {
            return this.socketId;
        };
        this.setSocketId = (socketId) => {
            this.socketId = socketId;
        };
        this.Connected = () => {
            return this.isConnected;
        };
        this.setConnected = (newConnected) => {
            this.isConnected = newConnected;
            if (newConnected === true) {
                clearTimeout(this.connectedTimeout);
            }
            else {
                this.connectedTimeout = setTimeout(() => {
                    // export type LEAVE_ROOM_BODY = {
                    //   roomId: string;
                    //   username: string;
                    // };
                    main_1.Main.leaveRoom({ roomId: this.roomId, username: this.username });
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
        this.getImgURL = () => {
            return this.imgURL;
        };
        this.getGameData = () => {
            return this.gameData;
        };
        this.setGameData = (newGameData) => {
            this.gameData = newGameData;
        };
        this.username = username;
        this.admin = isAdmin;
        this.roomId = roomId;
        // this.points = 0;
        this.isConnected = true;
        // this.myTurn = false;
        switch (gameType) {
            case enums_1.GAMES.Providence:
                this.gameData = {
                    myTurn: false,
                    points: 0,
                    currWord: undefined,
                    winThisRound: false,
                    winner: false,
                };
        }
    }
}
exports.User = User;
//# sourceMappingURL=player.js.map