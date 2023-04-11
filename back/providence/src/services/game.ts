import { Player } from "./player";
import { SocketServer } from "./socketServer";

export class Game {
    private roomId: string = undefined
    private players: Map<string, Player> = undefined;
    private minPlayers: number = undefined

    constructor(players: Map<string, Player> , roomId: string, minPlayers: number ) {
        this.players = players;
        this.roomId = roomId;
        this.minPlayers = minPlayers;
        setInterval(() => {
            SocketServer.sendGameMessage(this.roomId , this.players.size ); 
        }, 1000)
    }



}

