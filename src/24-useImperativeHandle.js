import React from './react';
import ReactDOM from './react-dom/client';

function App() {
    const inputRef = React.useRef(null);

    return (
        <div>
            <ForwardedInput ref={inputRef} />
            <button onClick={() => inputRef.current.focus()}>Focus</button>
        </div>
    );
}

const ForwardedInput = React.forwardRef(Input);

function Input(props, forwardRef) {
    const ref = React.useRef(null);

    React.useImperativeHandle(forwardRef, () => ({
        focus: () => {
            ref.current.focus();
        },
    }));

    return <input {...props} ref={ref} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
