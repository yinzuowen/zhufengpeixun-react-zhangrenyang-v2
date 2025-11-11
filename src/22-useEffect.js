import React from './react';
import ReactDOM from './react-dom/client';

function Counter() {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCount((count) => count + 1);
        }, 1000);
        return () => {
            console.log('clear interval');
            clearInterval(timer);
        };
    }, []);

    return <div>count: {count}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Counter />);
