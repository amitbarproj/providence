
export type ASYNC_RESPONSE<T=any> = {success: boolean, data?: T, description?: string}

export type CREATE_ROOM_BODY = {
    roomId: string,
    auth: boolean,
    secret?: string,
    username: string
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

