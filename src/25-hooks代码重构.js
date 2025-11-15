import React from './react';
import ReactDOM from './react-dom/client';

function App() {
    const inputRef = React.useRef(null);
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <ForwardedInput ref={inputRef} />
            <div>Count: {count}</div>
            <button onClick={() => setCount(count + 1)}>Count + 1</button>
        </div>
    );
}

const ForwardedInput = React.forwardRef(Input);

function Input(props) {
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <div>Child Count: {count}</div>
            <button onClick={() => setCount(count + 1)}>Child Count + 1</button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
