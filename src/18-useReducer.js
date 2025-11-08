import React from './react';
import ReactDOM from './react-dom/client';

const initialState = {
    count: 0,
};

function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        default:
            return state;
    }
}

function Counter() {
    const [state1, dispatch1] = React.useReducer(reducer, initialState);
    const [state2, dispatch2] = React.useReducer(reducer, initialState);
    return (
        <div>
            <p>count: {state1.count}</p>
            <button onClick={() => dispatch1({ type: 'INCREMENT' })}>+1</button>
            <button onClick={() => dispatch1({ type: 'DECREMENT' })}>-1</button>
            <p>count: {state2.count}</p>
            <button onClick={() => dispatch2({ type: 'INCREMENT' })}>+1</button>
            <button onClick={() => dispatch2({ type: 'DECREMENT' })}>-1</button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Counter />);
