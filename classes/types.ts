import { GAMES } from "./enums"

export type ASYNC_RESPONSE<T=any> = {success: boolean, data?: T, description?: string}

export type CREATE_ROOM_BODY = {
    roomId: string,
    auth: boolean,
    secret?: string,
    username: string,
    maxPlayers?: number,
    minPlayers?: number,
    description?: string,
    game: GAMES
}

export type CREATE_ROOM_RES = {

}

export type JOIN_ROOM_BODY = {
    roomId: string,
    secret?: string,
    username: string
}

export type JOIN_ROOM_RES = {

}

export type LEAVE_ROOM_BODY = {
    roomId: string,
    username: string
}

export type LEAVE_ROOM_RES = {

}

export type START_GAME_BODY = {
    roomId: string
}

export type START_GAME_RES = {

}

export type GET_ROOM_RES = {
    roomId: string,
    auth: boolean,
    numOfPlayers: number,
    maxPlayers: number,
    description: string,
    gameType: GAMES,
    isStarted: boolean
}

export type SOCKET_JOIN_ROOM_OBJ = {
    playersUsername: string[],
    youAdmin: boolean
}


export type CHECK_IF_USERNAME_BODY = {
    roomId: string,
    username: string
}

export type CHECK_IF_USERNAME_RES = {
    
}


