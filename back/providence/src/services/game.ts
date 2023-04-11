import e = require("cors");
import { Player } from "./player";
import { SocketServer } from "./socketServer";

export class Game {
    private roomId: string = undefined
    private players: Map<string, Player> = undefined;
    private minPlayers: number = undefined
    private myIterator = undefined;
    private currentPlayer = undefined

    constructor(players: Map<string, Player> , roomId: string, minPlayers: number ) {
        this.players = players;
        this.myIterator = this.players.entries();
        this.currentPlayer = this.myIterator.next();
        this.roomId = roomId;
        this.minPlayers = minPlayers;
        setInterval(() => {
             this.setNextPlayer();   
        }, 3000)

        setInterval(() => {
            console.log(this.currentPlayer.value);;   
       }, 500)
    }



    private setNextPlayer = () => {
       
        this.currentPlayer = this.myIterator.next();
        if(this.currentPlayer.done) {
            this.myIterator = this.players.entries();
            this.currentPlayer = this.myIterator.next();
        }

    }



}

        // SocketServer.sendGameMessage(this.roomId , this.currentPlayer.value );
