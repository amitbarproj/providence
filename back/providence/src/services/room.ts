import { ASYNC_RESPONSE, CREATE_ROOM_BODY, JOIN_ROOM_BODY, JOIN_ROOM_RES, LEAVE_ROOM_BODY } from "../../../../classes/types";
import { Game } from "./game";
import { Player } from "./player";

export class Room {
    private roomId: string = undefined
    private secret: string = undefined;
    private auth: boolean = undefined;
    private numOfPlayers: number = 0;
    private players: Map<string, Player> = new Map<string, Player>();
    private game:Game = undefined;

    constructor(createRoomBody: CREATE_ROOM_BODY) {
        this.roomId = createRoomBody.roomId;
        this.auth = createRoomBody.auth;
        this.secret = createRoomBody.secret;
        this.numOfPlayers++;
        this.players.set(createRoomBody.username , new Player(createRoomBody.username, true));
    }

    public joinRoom = (joinRoomBody: JOIN_ROOM_BODY)  => {
        this.players.set(joinRoomBody.username , new Player(joinRoomBody.username, false));
        this.numOfPlayers++;
    }
    
    public leaveRoom = (leaveRoomBody: LEAVE_ROOM_BODY)  => {
        this.players.delete(leaveRoomBody.username);
        this.numOfPlayers--;
    }

    public getPlayers = (): Map<string, Player>  => {
        return this.players;
    }

    public getSecret = (): string  => {
        return this.secret;
    }

    public needAuth = (): boolean  => {
        return this.auth;
    }

}

