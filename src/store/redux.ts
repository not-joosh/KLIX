import { createStore } from 'redux';

// Define the initial state
const initialState = {
    count: 0,
};

// Define the reducer function
function reducer(state = initialState, action: any) {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: state.count + 1 };
        case 'DECREMENT':
            return { ...state, count: state.count - 1 };
        default:
            return state;
    }
}

// Create the Redux store
const store = createStore(reducer);

export default store;
