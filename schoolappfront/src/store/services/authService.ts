import axios from "axios";
import jwtDecode from "jwt-decode";
import { DecodedJwt, DisplayUser, Jwt, LoginUser, NewUser } from "../interfaces/interfaces";

const register = async (newUser: NewUser): Promise<DisplayUser | null> => {
    const response = await axios.post(`${process.env.REACT_APP_BASE_API}/auth/register`, newUser);
    return response.data;
};

const login = async (user: LoginUser): Promise<{tokens: Jwt, user: DisplayUser }| null> => {
    //either returns a {access_token: string, refresh_token: string} or a HttpException('User not found!', HttpStatus.UNAUTHORIZED)
    const response = await axios.post(`${process.env.REACT_APP_BASE_API}/auth/login`, user);
    if (response.data) {
        //place the token that results from login in the LocalStorage for later access
        // localStorage.setItem('jwt', JSON.stringify(response.data));

        const decodedJwt:any = jwtDecode(response.data.refresh_token);
        return {
            tokens: response.data,
            user: {
                id: decodedJwt.id,
                firstName: decodedJwt.firstName,
                lastName: decodedJwt.lastName,
                email: decodedJwt.email,
                role: decodedJwt.role,
            },
        };
    }
    return null;
    
};

const logout = async (access_token: string) => {
    const response = await axios.post(`${process.env.REACT_APP_BASE_API}/auth/logout`, {}, {
        headers: {"Authorization" : `Bearer ${access_token}`}
        
      });
};

const refreshTokens = async (refresh_token: string) => {
    const response = await axios.post(`${process.env.REACT_APP_BASE_API}/auth/refresh`, {}, {
        headers: {"Authorization" : `Bearer ${refresh_token}`} 
      });
};

const verifyJwt = async (jwt: string): Promise<boolean> => {
    const response = await axios.post(`${process.env.REACT_APP_BASE_API}/auth/verify-jwt`, { jwt });

    //if the expiration date (must be converted to miliseconds because Date.now() is in miliseconds) is later than now, the token is valid, otherwise it's not
    if (response.data) {
        const jwtExpirationMiliseconds = response.data.exp * 1000;
        return jwtExpirationMiliseconds > Date.now();
    }
    return false;
};

const authService = {
    register,
    login,
    logout,
    refreshTokens,
    verifyJwt,
}

export default authService;