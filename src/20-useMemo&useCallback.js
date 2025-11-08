import React from './react';
import ReactDOM from './react-dom/client';

function App() {
    const [name, setName] = React.useState('zhufeng');
    const [age, setAge] = React.useState(10);
    const [count, setCount] = React.useState(0);

    const incrementCount = React.useCallback(() => {
        setCount((prevState) => prevState + 1);
    }, []);

    return (
        <div>
            <div>Name: {name}</div>
            <div>Age: {age}</div>
            <div>Count: {count}</div>
            <input
                type="text"
                value={name}
                onChange={(e) => {
                    debugger;
                    setName(e.target.value);
                }}
            />
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
            <MemoChildButton count={count} incrementCount={incrementCount} />
        </div>
    );
}

const MemoChildButton = React.memo(ChildButton);

function ChildButton({ count, incrementCount }) {
    console.log('Rendering Child Button');
    return <button onClick={incrementCount}>{count}</button>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
