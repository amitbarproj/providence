"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const random_avatar_generator_1 = require("random-avatar-generator");
const enums_1 = require("../../../../classes/enums");
const generator = new random_avatar_generator_1.AvatarGenerator();
// Simply get a random avatar
class User {
    constructor(username, isAdmin, gameType) {
        this.imgURL = generator.generateRandomAvatar();
        this.gameData = undefined;
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
            return (this.isConnected = newConnected);
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