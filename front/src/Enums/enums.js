const SOCKET_ENUMS = {
  YOU_ARE_NEW_ADMIN: "YOU_ARE_NEW_ADMIN",
  NEW_PLAYER_LEAVE: "NEW_PLAYER_LEAVE",
  NEW_PLAYER_JOIN: "NEW_PLAYER_JOIN",
  ADMIN_DISMISS_YOU: "ADMIN_DISMISS_YOU",
  START_GAME: "START_GAME",
  GAME_MSG: "GAME_MSG",
};

const GAMES = {
  Providence: "Providence",
  Poker: "Poker",
  Chat: "Chat",
};

const SERVER_URL = {
  protocol: "http",
  host: "10.0.0.8",
  port: "3002",
};
module.exports = {SOCKET_ENUMS , GAMES, SERVER_URL};
