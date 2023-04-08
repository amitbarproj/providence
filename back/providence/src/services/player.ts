import { Socket } from "socket.io";

export class Player {
    
    private username:  string;
    private admin: boolean; 
    private isConnected: boolean;
    private socketInstance: Socket = undefined

    constructor(username: string, isAdmin: boolean) {
        this.username = username;
        this.admin = isAdmin;
    }

    public isAdmin = (): boolean  => {
       return this.admin
    }

    public setIsAdmin = (isAdmin: boolean)  => {
        this.admin = isAdmin;
     }


     public getUserName = (): string  => {
        return this.username;
      }

      public getSocketInstance = (): Socket  => {
        return this.socketInstance;
      }

      public setSocketInstance = (socketInstance: Socket)  => {
        this.socketInstance = socketInstance;
      }
}

