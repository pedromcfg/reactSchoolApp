import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncState, AuthState, DisplayUser, Jwt, LoginUser, NewUser } from "../interfaces/interfaces";
import authService from "../services/authService";
import { RootState } from "../store";


//Initial state
const initialState: AuthState = {
    user: null, 
    jwt: null,
    isAuthenticated: false,
    isLoading: false, 
    isSuccessful: false, 
    isFailed: false,
}

// This is an asynchronous operation block basically
/* createAsyncThunk=  A function that accepts a Redux action type string and a callback function that should return a promise. It generates promise lifecycle action types based on the action type prefix that you pass in, and returns a thunk action creator that will run the promise callback and dispatch the lifecycle actions based on the returned promise. */
export const register = createAsyncThunk(
    'auth/register',
    async (user: NewUser, thunkAPI) => {
        try {
            const newUser = await authService.register(user);
            return newUser;
        } catch (error) {
            return thunkAPI.rejectWithValue('Unable to register!');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (user: LoginUser, thunkAPI) => {
        try {
            const loginUser = await authService.login(user);
            return loginUser;
        } catch (error) {
            return thunkAPI.rejectWithValue('User not found!');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (access_token: string, thunkAPI) => {
        try {
            await authService.logout(access_token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const refreshTokens = createAsyncThunk(
    'auth/refresh',
    async (refresh_token: string, thunkAPI) => {
        try {
            await authService.refreshTokens(refresh_token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const verifyJwt = createAsyncThunk(
    'auth/verify-jwt',
    async (jwt: string, thunkAPI) => {
        try {
            return await authService.verifyJwt(jwt);
        } catch (error) {
            return thunkAPI.rejectWithValue('Unable to verify!');
        }
    }
);

//The slice
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state: AsyncState) => {
            state.isLoading = false;
            state.isSuccessful = false;
            state.isFailed = false;
        },
    },
    extraReducers: (builder) => {
        builder
        //REGISTER
        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = true;
            // state.user = action.payload;
            
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isFailed = true;
            // state.user = null;
        })
        //LOGIN
        .addCase(login.pending, (state) => {
            state.isLoading = true;
            
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = true;
            state.jwt = action.payload?.tokens;
            state.user = action.payload?.user;
            state.isAuthenticated = true;
            
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isFailed = true;
            state.user = null;
            state.isAuthenticated = false;
            
        })
        //LOGOUT
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.jwt = null;
            state.isAuthenticated = false;
            state.isLoading = false; 
            state.isSuccessful = false; 
            state.isFailed = false;
        })
        //VERIFY JWT
        .addCase(verifyJwt.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(verifyJwt.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccessful = true;
            state.isAuthenticated = action.payload;
        })
        .addCase(verifyJwt.rejected, (state, action) => {
            state.isLoading = false;
            state.isFailed = true;
            state.isAuthenticated = false;
            console.log(action.payload)
        })
        //REFRESH TOKENS
        .addCase(refreshTokens.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(refreshTokens.fulfilled, (state, action) => {
            state.jwt = action.payload;
            state.isLoading = false; 
            state.isSuccessful = true; 
            state.isFailed = false;
        })
        .addCase(refreshTokens.rejected, (state, action) => {
            state.user = null;
            state.jwt = null;
            state.isAuthenticated = false;
            state.isLoading = false; 
            state.isSuccessful = false; 
            state.isFailed = false;
        })
    },
});

export const selectedUser = (state: RootState) => {
    return state.auth;
}
export const { reset } = authSlice.actions;
export default authSlice.reducer;

