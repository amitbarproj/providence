import { GAMES, PROVIDENCE_GAME_STATE } from "./enums";

export type ASYNC_RESPONSE<T = any> = {
  success: boolean;
  data?: T;
  description?: string;
};

export type CREATE_ROOM_BODY = {
  roomConfig: {
    roomId: string;
    auth: boolean;
    secret?: string;
    username: string;
    maxPlayers?: number;
    minPlayers?: number;
    description?: string;
  }
  game: GAMES;
  gameConfig: any
};

export type CHECK_ROOM_SETTINGS_BODY = {
  roomId: string;
  auth: boolean;
  secret?: string;
  username: string;
  maxPlayers?: number;
  minPlayers?: number;
  description?: string;
};

export type PROVIDENCE_CONFIG = {
  maxPoints: number
};

// const dataToSend = {
//   roomId: newRoomId.current.value,
//   auth: open,
//   secret: open ? newSecret.current.value : undefined,
//   username: newUsername.current.value,
//   description: open2 ? newDescription.current.value : "",
//   game: newGame,
//   gameConfig: {
//     maxPlayers: newMaxPlayers,
//     minPlayers: undefined,
//   },
// };

export type CREATE_ROOM_RES = {};

export type JOIN_ROOM_BODY = {
  roomId: string;
  secret?: string;
  username: string;
};

export type JOIN_ROOM_RES = {};

export type LEAVE_ROOM_BODY = {
  roomId: string;
  username: string;
};

export type LEAVE_ROOM_RES = {};

export type START_GAME_BODY = {
  roomId: string;
};

export type START_GAME_RES = {};

export type GET_ROOM_RES = {
  roomId: string;
  auth: boolean;
  numOfPlayers: number;
  maxPlayers: number;
  description: string;
  gameType: GAMES;
  isStarted: boolean;
};

export type SOCKET_JOIN_ROOM_OBJ = {
  players: PLAYER_SOCKET_DATA<any>[];
  youAdmin: boolean;
  gameType: GAMES;
  gameInfo: string;
  gameConfig: Object;
  gameStarted: boolean;
};

export type PROVIDENCE_GAME_INFO = {
  players: PLAYER_SOCKET_DATA<any>[];
  // youAdmin: boolean;
  // gameStarted: boolean;
  gameState: PROVIDENCE_GAME_STATE

};

export type PLAYER_SOCKET_DATA<T> = {
  username: string;
  isAdmin: boolean;
  isConnected: boolean;
  imgURL: string;
  gameData: T | any;
};

// export type PLAYER_DATA = any

export type PROVIDENCE_PLAYER_DATA = {
  myTurn: boolean;
  points: number;
  currWord: undefined
};

export type POKER_PLAYER_DATA = {
  bla: boolean;
  pop: number;
};

export type CHECK_IF_USERNAME_BODY = {
  roomId: string;
  username: string;
};

export type CHECK_IF_USERNAME_RES = {};
