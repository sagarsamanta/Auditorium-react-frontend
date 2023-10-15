import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/auth';
import movieReducer from './slice/movie';
import showReducer from './slice/show';
import seatReducer from './slice/seat';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
    key: 'iws-movie-auth',
    storage
};
const moviePersistConfig = {
    key: 'iws-movie-data',
    storage
};
const showPersistConfig = {
    key: 'iws-show-data',
    storage
};
const seatPersistConfig = {
    key: 'iws-seat-data',
    storage
};

const persistAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistMovieReducer = persistReducer(moviePersistConfig, movieReducer);
const persistShowReducer = persistReducer(showPersistConfig, showReducer);
const persistSeatReducer = persistReducer(seatPersistConfig, seatReducer);

export const store = configureStore({
    reducer: {
        auth: persistAuthReducer,
        movie: persistMovieReducer,
        show: persistShowReducer,
        seat: persistSeatReducer,
    }
});

export const persistedStore = persistStore(store);
