import { ASYNC_RESPONSE, CREATE_ROOM_BODY, JOIN_ROOM_BODY, JOIN_ROOM_RES, LEAVE_ROOM_BODY, START_GAME_RES } from "../../../../classes/types";
import { Game } from "./game";
import { Player } from "./player";
import { SocketServer } from "./socketServer";

const gameConf = require("../../../../../../../config/gameConf.json");


export class Room {
    private roomId: string = undefined
    private secret: string = undefined;
    private auth: boolean = undefined;
    private players: Map<string, Player> = new Map<string, Player>();
    private maxPlayers: number = undefined;
    private minPlayers: number = undefined;
    private game:Game = undefined;

    constructor(createRoomBody: CREATE_ROOM_BODY) {
        this.roomId = createRoomBody.roomId;
        this.auth = createRoomBody.auth;
        this.secret = createRoomBody.secret;
        this.maxPlayers = createRoomBody.maxPlayers || gameConf.maxPlayers;
        this.minPlayers = createRoomBody.minPlayers || gameConf.minPlayers;
        this.players.set(createRoomBody.username , new Player(createRoomBody.username, true));
    }

    public joinRoom = (joinRoomBody: JOIN_ROOM_BODY)  => {
        this.players.set(joinRoomBody.username , new Player(joinRoomBody.username, false));
    }
    
    public leaveRoom = async(leaveRoomBody: LEAVE_ROOM_BODY)  => {
        const deletedPlayer: Player = this.players.get(leaveRoomBody.username);
        if(deletedPlayer.isAdmin()) {
            if(this.getNumOfPlayers() > 1) {
                const newAdminPlayer: Player = this.getFirstNonAdminPlayer();
                newAdminPlayer.setIsAdmin(true);
            }
        }
        if(deletedPlayer.getSocketId()) {
          await SocketServer.leaveClient(this.roomId , deletedPlayer.getSocketId());
        }
        this.players.delete(leaveRoomBody.username);
    }

    public getPlayers = (): Map<string, Player>  => {
        return this.players;
    }

    public startGame = ()  => {
        this.game = new Game(this.players , this.roomId );
    }

    public gameStarted = (): boolean  => {
        return this.game ? true : false;
    }

    public getSecret = (): string  => {
        return this.secret;
    }

    public needAuth = (): boolean  => {
        return this.auth;
    }

    public getNumOfPlayers = (): number  => {
        return this.players.size;
    }

    public getRoomId = (): string  => {
        return this.roomId;
    }

    public getMaxPlayers = (): number  => {
        return this.maxPlayers;
    }

    public getMinPlayers = (): number  => {
        return this.minPlayers;
    }


    private getFirstNonAdminPlayer = (): Player => {
        let ans: Player = undefined;
        this.players.forEach(player => {
            if(!player.isAdmin()) {
                ans =  player;
            }
        })
        return ans;
    }
}

