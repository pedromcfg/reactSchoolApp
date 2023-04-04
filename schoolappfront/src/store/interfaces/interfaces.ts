export type Jwt = { access_token: string, refresh_token: string} | null;

export interface DisplayUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    enabled?: string;
}

export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface DecodedJwt {
    user: DisplayUser;
    exp: number;    //expiration date
    iat: number;    //initialization date
}

export interface AsyncState {
    isLoading: boolean;
    isSuccessful: boolean;
    isFailed: boolean;
}

export interface AuthState extends AsyncState {
    user?: DisplayUser | null;
    jwt?: Jwt;
    isAuthenticated?: boolean;
}