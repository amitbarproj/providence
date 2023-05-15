export enum SOCKET_ENUMS {
  YOU_ARE_NEW_ADMIN = "YOU_ARE_NEW_ADMIN",
  // NEW_PLAYER_LEAVE = "NEW_PLAYER_LEAVE",
  // NEW_PLAYER_JOIN = "NEW_PLAYER_JOIN",
  UPDATE_PLAYERS_STATE = "UPDATE_PLAYERS_STATE",
  ADMIN_DISMISS_YOU = "ADMIN_DISMISS_YOU",
  START_GAME = "START_GAME",
  GAME_MSG = "GAME_MSG",
  ERROR = "ERROR",
}

export enum SOCKET_ROOMS_TYPE {}

export enum SOCKET_GAME {
  NEW_PLAYER_TURN = "NEW_PLAYER_TURN",
  UPDATE_ALL_CLOCK = "UPDATE_ALL_CLOCK",
  UPDATE_PLAYER_CLOCK = "UPDATE_PLAYER_CLOCK",
  UPDATE_GAME_STATE = "UPDATE_GAME_STATE",
  UPDATE_PLAYERS= "UPDATE_PLAYERS"


}


export enum PROVIDENCE_SOCKET_GAME {
  SEND_PLAYER_WORD = "SEND_PLAYER_WORD",
  SEND_MAIN_WORD = "SEND_MAIN_WORD",
  GET_GAME_INFO = "GET_GAME_INFO",
  START_NEW_GAME ="START_NEW_GAME"

}
