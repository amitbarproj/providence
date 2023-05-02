import { Socket } from "socket.io";
import { AvatarGenerator } from "random-avatar-generator";
import { GAMES } from "../../../../classes/enums";

const generator = new AvatarGenerator();

// Simply get a random avatar

export class User {
  private username: string;
  private admin: boolean;
  private isConnected: boolean;
  private socketId: string;
  private points: number;
  private imgURL: string = generator.generateRandomAvatar();
  private gameData: any = undefined;

  constructor(username: string, isAdmin: boolean, gameType: GAMES) {
    this.username = username;
    this.admin = isAdmin;
    // this.points = 0;
    this.isConnected = true;
    // this.myTurn = false;
    switch (gameType) {
      case GAMES.Providence:
        this.gameData = { 
          myTurn: false,
          points: 0,
          currWord: undefined,
          winThisRound: false
        };
    }
  }

  public isAdmin = (): boolean => {
    return this.admin;
  };

  public setIsAdmin = (isAdmin: boolean) => {
    this.admin = isAdmin;
  };

  public getUserName = (): string => {
    return this.username;
  };

  public getSocketId = (): string => {
    return this.socketId;
  };

  public setSocketId = (socketId: string) => {
    this.socketId = socketId;
  };

  public Connected = (): boolean => {
    return this.isConnected;
  };

  public setConnected = (newConnected: boolean) => {
    return (this.isConnected = newConnected);
  };

  public getImgURL = (): string => {
    return this.imgURL;
  };

  public getGameData = (): any => {
    return this.gameData;
  };
}
