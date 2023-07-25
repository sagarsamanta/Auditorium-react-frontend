import Axios from '@/lib/axiosInstance';
import { AUTH_USER_COOKIE } from '@/lib/consts';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from 'cookies-next';

export const loginUser = createAsyncThunk('auth/login', async (user) => {
    const result = await Axios('POST', '/user/login', user);

    if (result.status === 200) {
        const authUser = result.data;
        setCookie(AUTH_USER_COOKIE, JSON.stringify(authUser), { maxAge: 60 * 60 * 24 * 30, sameSite: 'strict', secure: false });
        return { ...authUser };
    }
    return {
        user: null,
        token: null,
        error: 'err.message',
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        isError: false,
    },
    reducers: {
        logout: (state) => {
            deleteCookie(AUTH_USER_COOKIE);
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.isLoading = false;
            state.isError = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoading = false;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
        });
    }
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;