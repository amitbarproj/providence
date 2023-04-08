import { Player } from "./player";
import { SocketServer } from "./socketServer";

export class Game {
    private roomId: string = undefined
    private players: Map<string, Player> = undefined;

    constructor(players: Map<string, Player> , roomId: string ) {
        this.players = players;
        this.roomId = roomId;
        setInterval(() => {
            SocketServer.sendGameMessage(this.roomId , this.players.size ); 
        }, 1000)
    }



}

