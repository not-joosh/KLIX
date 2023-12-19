import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
    count: 0,
};

// Create a slice using Redux Toolkit
const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.count += 1;
        },
        decrement: (state) => {
            state.count -= 1;
        },
    },
});

// Create the Redux store using Redux Toolkit
const store = configureStore({
    reducer: counterSlice.reducer,
});

// Export the actions and reducer from the slice
export const { increment, decrement } = counterSlice.actions;

export default store;
