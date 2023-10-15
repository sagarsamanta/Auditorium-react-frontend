import { ADMIN_TOKEN, API_ROOT } from '@/lib/consts';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Show API call
export const addShowDetails = createAsyncThunk('movie/addShowDetails', async ({ movieId, show }) => {
    const response = await fetch(`${API_ROOT}/show/${movieId}`, {
        method: 'POST',
        body: JSON.stringify([show]),
        headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data?.shows || {};
});

export const updateShowDetails = createAsyncThunk('movie/updateShowDetails', async ({ movieId, showId, show }) => {
    const response = await fetch(`${API_ROOT}/show/${movieId}/${showId}`, {
        method: 'PUT',
        body: JSON.stringify(show),
        headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data?.show || {};
});

const showSlice = createSlice({
    name: "show",
    initialState: {
        show: {},
        isLoading: false,
        isError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Add Show
        builder.addCase(addShowDetails.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addShowDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.show = action.payload;
        });
        builder.addCase(addShowDetails.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });

        // Update Show
        builder.addCase(updateShowDetails.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateShowDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.show = action.payload;
        });
        builder.addCase(updateShowDetails.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    }
});
export default showSlice.reducer;