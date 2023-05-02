const SOCKET_ENUMS = {
  YOU_ARE_NEW_ADMIN: "YOU_ARE_NEW_ADMIN",
  // NEW_PLAYER_LEAVE: "NEW_PLAYER_LEAVE",
  // NEW_PLAYER_JOIN: "NEW_PLAYER_JOIN",
  UPDATE_PLAYERS_STATE: "UPDATE_PLAYERS_STATE",
  ADMIN_DISMISS_YOU: "ADMIN_DISMISS_YOU",
  START_GAME: "START_GAME",
  GAME_MSG: "GAME_MSG",
  ERROR: "ERROR"
};


const SOCKET_GAME = {
  NEW_PLAYER_TURN: "NEW_PLAYER_TURN",
  UPDATE_CLOCK:"UPDATE_CLOCK"
}




const GAMES = {
  Providence: "Providence",
  Poker: "Poker",
  Chat: "Chat",
};

const LOCAL_STORAGE = {
  UserInfo: "UserInfo",
};

const SERVER_URL = {
  protocol: "http",
  // host: "192.168.1.181",
  // host: "192.168.68.108",
  host: "10.0.0.8",

  port: "3002",
};
module.exports = {SOCKET_ENUMS , GAMES, SERVER_URL, LOCAL_STORAGE, SOCKET_GAME};
