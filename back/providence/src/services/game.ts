// import e = require("cors");
import { User } from "./player";
import { SocketServer } from "./socketServer";

//Need to do this abstract class
export class Game {
    private roomId: string = undefined
    private players: Map<string, User> = undefined;
    private minPlayers: number = undefined
    private myIterator = undefined;
    private currentPlayer = undefined

    constructor(players: Map<string, User> , roomId: string, minPlayers: number ) {
        this.players = players;
        this.myIterator = this.players.entries();
        this.currentPlayer = this.myIterator.next();
        this.roomId = roomId;
        this.minPlayers = minPlayers;
        setInterval(() => {
             this.setNextPlayer();   
        }, 3000)

     
    }



    private setNextPlayer = () => {
       
        this.currentPlayer = this.myIterator.next();
        if(this.currentPlayer.done) {
            this.myIterator = this.players.entries();
            this.currentPlayer = this.myIterator.next();
        }
        if(this.currentPlayer.value) {
            SocketServer.sendGameMessage( this.roomId, `${this.currentPlayer.value[1].username}`);
        }
        else{
            //NO PLAYERS IN GAME
        }

    }



}

