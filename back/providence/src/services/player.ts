import { Socket } from "socket.io";
import { AvatarGenerator } from "random-avatar-generator";
import { GAMES } from "../../../../classes/enums";
import { PLAYER_DATA } from "../../../../classes/types";

const generator = new AvatarGenerator();

// Simply get a random avatar

export class User {
  setMyTurn(arg0: boolean) {
      throw new Error("Method not implemented.");
  }
  private username: string;
  private admin: boolean;
  private isConnected: boolean;
  private socketId: string;
  private points: number;
  private imgURL: string = generator.generateRandomAvatar();
  private myTurn: boolean;
  private gameType: GAMES = undefined;
  private gameData: PLAYER_DATA = undefined;

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

  public getPoints = (): number => {
    return this.points;
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

  // public getMyTurn = (): boolean => {
  //   return this.myTurn;
  // };

  // public setMyTurn = (newTurn: boolean) => {
  //   this.myTurn = newTurn;
  // };

  public getGameData = (): PLAYER_DATA => {
    return this.gameData;
  };
}
