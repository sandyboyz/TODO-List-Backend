import {BaseUser, User} from './user'

export interface BaseOneTimeToken {
    user: BaseUser,
    token: string
}

export interface OneTimeToken extends BaseOneTimeToken {
    id: number
}

export interface OneTimeTokenDetail extends OneTimeToken {
    user: User
}
