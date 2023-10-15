import { ADMIN_TOKEN, API_ROOT } from '@/lib/consts';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const addMovie = createAsyncThunk('movie/addMovie', async (movie) => {
    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('description', movie.description);
    formData.append('releaseDate', movie.date);
    formData.append('duration', movie.duration);
    formData.append('language', movie.language);
    formData.append('poster', movie.image);

    const response = await fetch(`${API_ROOT}/movie/`, {
        headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
        },
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    return data?.movie || {};
});

const movieSlice = createSlice({
    name: "movie",
    initialState: {
        movie: {},
        shows: [],
        isLoading: false,
        isError: false,
    },
    reducers: {
        saveShowWithMovie: (state, action) => {
            state.shows.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addMovie.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addMovie.fulfilled, (state, action) => {
            state.isLoading = false;
            state.movie = action.payload;
        });
        builder.addCase(addMovie.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    }
});
export const { saveShowWithMovie } = movieSlice.actions;
export default movieSlice.reducer;