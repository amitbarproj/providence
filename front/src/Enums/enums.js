const SOCKET_ENUMS = {
  YOU_ARE_NEW_ADMIN: "YOU_ARE_NEW_ADMIN",
  UPDATE_PLAYERS_STATE: "UPDATE_PLAYERS_STATE",
  ADMIN_DISMISS_YOU: "ADMIN_DISMISS_YOU",
  START_GAME: "START_GAME",
  GAME_MSG: "GAME_MSG",
  ERROR: "ERROR",
};

const SOCKET_GAME = {
  NEW_PLAYER_TURN: "NEW_PLAYER_TURN",
  UPDATE_ALL_CLOCK: "UPDATE_ALL_CLOCK",
  UPDATE_PLAYER_CLOCK: "UPDATE_PLAYER_CLOCK",
  UPDATE_GAME_STATE: "UPDATE_GAME_STATE",
  UPDATE_PLAYERS: "UPDATE_PLAYERS",
};

const PROVIDENCE_GAME_STATE = {
  PLAYER_CLOCK: "PLAYER_CLOCK",
  ALL_CLOCK: "ALL_CLOCK",
  CALCULATE_ROUND: "CALCULATE_ROUND",
  END_OF_GAME: "END_OF_GAME",
};

const PROVIDENCE_SOCKET_GAME = {
  SEND_PLAYER_WORD: "SEND_PLAYER_WORD",
  SEND_MAIN_WORD: "SEND_MAIN_WORD",
};

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
  host: "16.16.203.55" ,
  // host: "10.0.0.8",

  port: "3002",
};

const PLAYERS_BACKGROUND_COLOR = {
  Winner: `radial-gradient(circle farthest-side, #fceabb, #f8b500)`,
  WinRound: `linear-gradient(to bottom right, #72FFB6, #10D164)`,
  Me: ` linear-gradient( 109.6deg, rgba(156,252,248,1) 11.2%, rgba(110,123,251,1) 91.1% )`,
  Regular: `linear-gradient(to bottom right, #FDFCFB, #E2D1C3)`,
};

const BACKGROUNDS = {
  GameHeader: `#FAF9F6`,
  AppBar: `linear-gradient(to bottom right, #00C0FF, #4218B8)`,
  JoinRoomButtun: `linear-gradient(to bottom right, #00C0FF, #4218B8)`,
};

module.exports = {
  PLAYERS_BACKGROUND_COLOR,
  SOCKET_ENUMS,
  GAMES,
  SERVER_URL,
  LOCAL_STORAGE,
  SOCKET_GAME,
  PROVIDENCE_SOCKET_GAME,
  PROVIDENCE_GAME_STATE,
  BACKGROUNDS,
};
