import { ADMIN_TOKEN, API_ROOT } from '@/lib/consts';
import { createSlice } from '@reduxjs/toolkit';

const showSlice = createSlice({
    name: "seat",
    initialState: {
        seat: {
            selected: {}
        },
        isLoading: false,
        isError: false,
    },
    reducers: {
        setSelectedSeat: (state, action) => {
            state.seat.selected = action.payload;
        }
    },
    extraReducers: (builder) => { }
});

export const { setSelectedSeat } = showSlice.actions;
export default showSlice.reducer;