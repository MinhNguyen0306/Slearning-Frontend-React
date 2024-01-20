import { User } from "../../model/User"

export type Tokens = {
    access_token: string,
    refersh_token: string
}

export interface AuthenticationResponse {
    user: User,
    tokens: Tokens
}