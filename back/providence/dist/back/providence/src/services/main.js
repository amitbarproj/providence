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
exports.Main = void 0;
const api_enums_1 = require("../../../../classes/api_enums");
const enums_1 = require("../../../../classes/enums");
const room_1 = require("./room");
class Main {
    constructor() {
        this.rooms = new Map();
        this.init = (app) => {
            console.log("init Main...");
            this.listenToAllRestPaths(app);
        };
        this.getRooms = () => {
            return this.rooms;
        };
        this.deleteRoom = (roomId) => {
            if (this.rooms.has(roomId)) {
                const currRoom = this.rooms.get(roomId);
                currRoom.getPlayers().forEach((player) => __awaiter(this, void 0, void 0, function* () {
                    yield currRoom.leaveRoom({
                        username: player.getUserName(),
                        roomId: roomId,
                    });
                }));
                currRoom.deleteRoom();
                this.rooms.delete(roomId);
            }
        };
        this.leaveRoom = (leaveRoomBody) => __awaiter(this, void 0, void 0, function* () {
            const ans = { success: false };
            if (this.rooms.has(leaveRoomBody.roomId)) {
                const currRoom = this.rooms.get(leaveRoomBody.roomId);
                if (currRoom.getPlayers().has(leaveRoomBody.username)) {
                    yield currRoom.leaveRoom(leaveRoomBody);
                    if (currRoom.gameStarted() &&
                        currRoom.getNumOfPlayers() < currRoom.getGame().getMinPlayers()) {
                        currRoom.getGame().endGame();
                    }
                    if (currRoom.getNumOfPlayers() === 0) {
                        this.deleteRoom(leaveRoomBody.roomId);
                    }
                    ans.success = true;
                }
                else {
                    ans.description = `${leaveRoomBody.username} not exist in Room ${leaveRoomBody.roomId}`;
                }
            }
            else {
                ans.description = `Room ${leaveRoomBody.roomId} not exist`;
            }
            return ans;
        });
        this.listenToAllRestPaths = (app) => {
            app.post(api_enums_1.SERVER_API.createRoom, (req, res) => {
                const ans = { success: false };
                const createRoomBody = req.body;
                console.log(createRoomBody);
                if (createRoomBody.roomConfig.roomId === "") {
                    ans.description = `Please enter Room ID`;
                }
                else if (createRoomBody.game === enums_1.GAMES.Error) {
                    ans.description = `Please select a Game`;
                }
                else if (createRoomBody.roomConfig.roomId.length > 15) {
                    ans.description = `Room ID must be maximum 15 letters`;
                }
                else if (createRoomBody.roomConfig.description &&
                    createRoomBody.roomConfig.description.length > 50) {
                    ans.description = `Room description must be maximum 50 letters`;
                }
                else if (createRoomBody.roomConfig.username === "") {
                    ans.description = `Please enter Username`;
                }
                else if (createRoomBody.roomConfig.username.length > 10) {
                    ans.description = `Username must be maximum 10 letters`;
                }
                else if (!this.rooms.has(createRoomBody.roomConfig.roomId)) {
                    this.rooms.set(createRoomBody.roomConfig.roomId, new room_1.Room(createRoomBody));
                    ans.success = true;
                }
                else {
                    ans.description = `Room ${createRoomBody.roomConfig.roomId} already exist. Please choose another ID`;
                }
                res.send(ans);
            });
            app.post(api_enums_1.SERVER_API.checkRoomSettings, (req, res) => {
                const ans = { success: false };
                const createRoomBody = req.body;
                console.log(createRoomBody);
                if (createRoomBody.roomId === "") {
                    ans.description = `Please enter Room ID`;
                }
                else if (createRoomBody.roomId.length > 15) {
                    ans.description = `Room ID must be maximum 15 letters`;
                }
                else if (createRoomBody.description &&
                    createRoomBody.description.length > 50) {
                    ans.description = `Room description must be maximum 50 letters`;
                }
                else if (createRoomBody.username === "") {
                    ans.description = `Please enter Username`;
                }
                else if (createRoomBody.username.length > 10) {
                    ans.description = `Username must be maximum 10 letters`;
                }
                else if (!this.rooms.has(createRoomBody.roomId)) {
                    ans.success = true;
                }
                else {
                    ans.description = `Room ${createRoomBody.roomId} already exist. Please choose another ID`;
                }
                res.send(ans);
            });
            app.post(api_enums_1.SERVER_API.joinRoom, (req, res) => {
                const ans = { success: false };
                const joinRoomBody = req.body;
                console.log(joinRoomBody);
                if (this.rooms.has(joinRoomBody.roomId)) {
                    const currRoom = this.rooms.get(joinRoomBody.roomId);
                    if (joinRoomBody.username === "") {
                        ans.description = `Please enter Username`;
                    }
                    else if (currRoom.getNumOfPlayers() >= currRoom.getMaxPlayers()) {
                        ans.description = `Room ${joinRoomBody.roomId} has maximum players`;
                    }
                    else if (currRoom.gameStarted()) {
                        ans.description = `Game in room ${joinRoomBody.roomId} already started`;
                    }
                    else if (currRoom.getPlayers().has(joinRoomBody.username)) {
                        ans.description = `${joinRoomBody.username} already exist in Room ${joinRoomBody.roomId}`;
                    }
                    else if (joinRoomBody.username.length > 10) {
                        ans.description = `Username must be maximum 10 letters`;
                    }
                    else if (currRoom.needAuth() &&
                        currRoom.getSecret() !== joinRoomBody.secret) {
                        ans.description = `Invalid Password`;
                    }
                    else {
                        currRoom.joinRoom(joinRoomBody);
                        ans.success = true;
                    }
                }
                else {
                    ans.description = `Room ${joinRoomBody.roomId} not exist`;
                }
                res.send(ans);
            });
            app.post(api_enums_1.SERVER_API.leaveRoom, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const leaveRoomBody = req.body;
                console.log("sdfgsdfgfdsgfsdgsfdgdsfgfdsgfdsgdfsg");
                const ans = yield this.leaveRoom(leaveRoomBody);
                res.send(ans);
            }));
            app.get(api_enums_1.SERVER_API.getAllRooms, (req, res) => {
                const ans = { success: true, data: [] };
                this.rooms.forEach((room) => {
                    ans.data.push({
                        roomId: room.getRoomId(),
                        auth: room.needAuth(),
                        description: room.getDescription(),
                        numOfPlayers: room.getNumOfPlayers(),
                        maxPlayers: room.getMaxPlayers(),
                        isStarted: room.gameStarted(),
                        gameType: room.getGameType(),
                    });
                });
                res.send(ans);
            });
            app.get(api_enums_1.SERVER_API.getPlayersByRoom, (req, res) => {
                let ans = [];
                const getPlayersByRoomBody = req.body;
                if (this.rooms.has(getPlayersByRoomBody.roomId)) {
                    this.rooms
                        .get(getPlayersByRoomBody.roomId)
                        .getPlayers()
                        .forEach((bla) => {
                        ans.push(bla);
                    });
                }
                res.send(ans);
            });
            app.post(api_enums_1.SERVER_API.startGame, (req, res) => {
                const ans = { success: false };
                const startRoomBody = req.body;
                if (this.rooms.has(startRoomBody.roomId)) {
                    const currRoom = this.rooms.get(startRoomBody.roomId);
                    if (currRoom.gameStarted()) {
                        ans.description = `Game in room ${startRoomBody.roomId} already started`;
                    }
                    else {
                        currRoom.startGame();
                        ans.description = `Game in room ${startRoomBody.roomId} started right now`;
                        ans.success = true;
                    }
                }
                res.send(ans);
            });
            app.post(api_enums_1.SERVER_API.checkIfUsernameExistInRoom, (req, res) => {
                const ans = { success: false };
                const checkUsername = req.body;
                if (this.rooms.has(checkUsername.roomId)) {
                    const currRoom = this.rooms.get(checkUsername.roomId);
                    if (currRoom.getPlayersUsername().includes(checkUsername.username)) {
                        ans.success = true;
                        ans.data = {
                            isAdmin: currRoom
                                .getPlayers()
                                .get(checkUsername.username)
                                .isAdmin(),
                            playersUsername: currRoom.getPlayersUsername(),
                            username: checkUsername.username,
                        };
                    }
                }
                res.send(ans);
            });
        };
    }
}
Main.instance = new Main();
Main.leaveRoom = Main.instance.leaveRoom;
Main.init = Main.instance.init;
Main.getRooms = Main.instance.getRooms;
exports.Main = Main;
//# sourceMappingURL=main.js.map