import { Socket } from "socket.io";
import { AvatarGenerator } from 'random-avatar-generator';
 
const generator = new AvatarGenerator();
 
// Simply get a random avatar

export class User {
    
    private username:  string;
    private admin: boolean; 
    private isConnected: boolean;
    private socketId: string;
    private points: number;
    private imgURL: string = generator.generateRandomAvatar();


    constructor(username: string, isAdmin: boolean) {
        this.username = username;
        this.admin = isAdmin;
        this.points = 0;
        this.isConnected = true;
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

       public getSocketId = (): string  => {
        return this.socketId;
      }

      public setSocketId = (socketId: string)  => {
        this.socketId = socketId;
      }
      
      public getPoints = (): number  => {
        return this.points;
      }

      public Connected = (): boolean  => {
        return this.isConnected;
      }

      public setConnected = (newConnected: boolean)  => {
        return this.isConnected = newConnected;
      }

      public getImgURL = (): string  => {
        return this.imgURL;
     }
}

