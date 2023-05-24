import { SERVER_API } from "../../../../classes/api_enums";
import { GAMES } from "../../../../classes/enums";
import { SOCKET_ENUMS } from "../../../../classes/socketEnums";
import {
  ASYNC_RESPONSE,
  CHECK_IF_USERNAME_BODY,
  CHECK_IF_USERNAME_RES,
  CHECK_ROOM_SETTINGS_BODY,
  CREATE_ROOM_BODY,
  CREATE_ROOM_RES,
  GET_ROOM_RES,
  JOIN_ROOM_BODY,
  JOIN_ROOM_RES,
  LEAVE_ROOM_BODY,
  LEAVE_ROOM_RES,
  START_GAME_BODY,
  START_GAME_RES,
} from "../../../../classes/types";
import { Room } from "./room";
import { SocketServer } from "./socketServer";

export class Main {
  private static instance: Main = new Main();
  private rooms: Map<string, Room> = new Map<string, Room>();

  constructor() {}

  private init = (app) => {
    console.log("init Main...");
    this.listenToAllRestPaths(app);
  };

  private getRooms = (): Map<string, Room> => {
    return this.rooms;
  };

  private deleteRoom = (roomId: string) => {
    if (this.rooms.has(roomId)) {
      const currRoom: Room = this.rooms.get(roomId);
      currRoom.getPlayers().forEach(async (player) => {
        await currRoom.leaveRoom({
          username: player.getUserName(),
          roomId: roomId,
        });
      });
      currRoom.deleteRoom();
      this.rooms.delete(roomId);
    }
  };

  private leaveRoom = async (
    leaveRoomBody: LEAVE_ROOM_BODY
  ): Promise<ASYNC_RESPONSE<LEAVE_ROOM_RES>> => {
    const ans: ASYNC_RESPONSE<LEAVE_ROOM_RES> = { success: false };
    if (this.rooms.has(leaveRoomBody.roomId)) {
      const currRoom: Room = this.rooms.get(leaveRoomBody.roomId);
      if (currRoom.getPlayers().has(leaveRoomBody.username)) {
        await currRoom.leaveRoom(leaveRoomBody);
        if (
          currRoom.gameStarted() &&
          currRoom.getNumOfPlayers() < currRoom.getGame().getMinPlayers()
        ) {
          currRoom.getGame().endGame();
        }
        if (currRoom.getNumOfPlayers() === 0) {
          this.deleteRoom(leaveRoomBody.roomId);
        }
        ans.success = true;
      } else {
        ans.description = `${leaveRoomBody.username} not exist in Room ${leaveRoomBody.roomId}`;
      }
    } else {
      ans.description = `Room ${leaveRoomBody.roomId} not exist`;
    }
    return ans;
  };

  private listenToAllRestPaths = (app) => {
    app.post(SERVER_API.createRoom, (req, res) => {
      const ans: ASYNC_RESPONSE<CREATE_ROOM_RES> = { success: false };
      const createRoomBody: CREATE_ROOM_BODY = req.body;
      console.log(createRoomBody);
      if (createRoomBody.roomConfig.roomId === "") {
        ans.description = `Please enter Room ID`;
      } else if (createRoomBody.game === GAMES.Error) {
        ans.description = `Please select a Game`;
      } else if (createRoomBody.roomConfig.roomId.length > 15) {
        ans.description = `Room ID must be maximum 15 letters`;
      } else if (
        createRoomBody.roomConfig.description &&
        createRoomBody.roomConfig.description.length > 50
      ) {
        ans.description = `Room description must be maximum 50 letters`;
      } else if (createRoomBody.roomConfig.username === "") {
        ans.description = `Please enter Username`;
      } else if (createRoomBody.roomConfig.username.length > 10) {
        ans.description = `Username must be maximum 10 letters`;
      } else if (!this.rooms.has(createRoomBody.roomConfig.roomId)) {
        this.rooms.set(createRoomBody.roomConfig.roomId, new Room(createRoomBody));
        ans.success = true;
      } else {
        ans.description = `Room ${createRoomBody.roomConfig.roomId} already exist. Please choose another ID`;
      }
      res.send(ans);
    });

    app.post(SERVER_API.checkRoomSettings, (req, res) => {
      const ans: ASYNC_RESPONSE = { success: false };
      const createRoomBody: CHECK_ROOM_SETTINGS_BODY = req.body;
      console.log(createRoomBody);
      if (createRoomBody.roomId === "") {
        ans.description = `Please enter Room ID`;
      } else if (createRoomBody.roomId.length > 15) {
        ans.description = `Room ID must be maximum 15 letters`;
      } else if (
        createRoomBody.description &&
        createRoomBody.description.length > 50
      ) {
        ans.description = `Room description must be maximum 50 letters`;
      } else if (createRoomBody.username === "") {
        ans.description = `Please enter Username`;
      } else if (createRoomBody.username.length > 10) {
        ans.description = `Username must be maximum 10 letters`;
      } else if (!this.rooms.has(createRoomBody.roomId)) {
        ans.success = true;
      } else {
        ans.description = `Room ${createRoomBody.roomId} already exist. Please choose another ID`;
      }
      res.send(ans);
    });

    

    app.post(SERVER_API.joinRoom, (req, res) => {
      const ans: ASYNC_RESPONSE<JOIN_ROOM_RES> = { success: false };
      const joinRoomBody: JOIN_ROOM_BODY = req.body;
      console.log(joinRoomBody);
      if (this.rooms.has(joinRoomBody.roomId)) {
        const currRoom: Room = this.rooms.get(joinRoomBody.roomId);
        if (joinRoomBody.username === "") {
          ans.description = `Please enter Username`;
        } else if (currRoom.getNumOfPlayers() >= currRoom.getMaxPlayers()) {
          ans.description = `Room ${joinRoomBody.roomId} has maximum players`;
        } else if (currRoom.gameStarted()) {
          ans.description = `Game in room ${joinRoomBody.roomId} already started`;
        } else if (currRoom.getPlayers().has(joinRoomBody.username)) {
          ans.description = `${joinRoomBody.username} already exist in Room ${joinRoomBody.roomId}`;
        } else if (joinRoomBody.username.length > 10) {
          ans.description = `Username must be maximum 10 letters`;
        } else if (
          currRoom.needAuth() &&
          currRoom.getSecret() !== joinRoomBody.secret
        ) {
          ans.description = `Invalid Password`;
        } else {
          currRoom.joinRoom(joinRoomBody);
          ans.success = true;
        }
      } else {
        ans.description = `Room ${joinRoomBody.roomId} not exist`;
      }
      res.send(ans);
    });

    app.post(SERVER_API.leaveRoom, async (req, res) => {
      const leaveRoomBody: LEAVE_ROOM_BODY = req.body;
      console.log("sdfgsdfgfdsgfsdgsfdgdsfgfdsgfdsgdfsg");
      const ans = await this.leaveRoom(leaveRoomBody);
      res.send(ans);
    });

    app.get(SERVER_API.getAllRooms, (req, res) => {
      const ans: ASYNC_RESPONSE<GET_ROOM_RES[]> = { success: true, data: [] };
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

    app.get(SERVER_API.getPlayersByRoom, (req, res) => {
      let ans: any[] = [];
      const getPlayersByRoomBody: { roomId: string } = req.body;
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

    app.post(SERVER_API.startGame, (req, res) => {
      const ans: ASYNC_RESPONSE<START_GAME_RES> = { success: false };
      const startRoomBody: START_GAME_BODY = req.body;
      if (this.rooms.has(startRoomBody.roomId)) {
        const currRoom: Room = this.rooms.get(startRoomBody.roomId);
        if (currRoom.gameStarted()) {
          ans.description = `Game in room ${startRoomBody.roomId} already started`;
        } else {
          currRoom.startGame();
          ans.description = `Game in room ${startRoomBody.roomId} started right now`;
          ans.success = true;
        }
      }
      res.send(ans);
    });

    app.post(SERVER_API.checkIfUsernameExistInRoom, (req, res) => {
      const ans: ASYNC_RESPONSE<CHECK_IF_USERNAME_RES> = { success: false };
      const checkUsername: CHECK_IF_USERNAME_BODY = req.body;
      if (this.rooms.has(checkUsername.roomId)) {
        const currRoom: Room = this.rooms.get(checkUsername.roomId);
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

  public static leaveRoom = Main.instance.leaveRoom;
  public static init = Main.instance.init;
  public static getRooms = Main.instance.getRooms;
}
