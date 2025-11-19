import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return (
        <div>
            <h1>请移动你的鼠标</h1>
            <MouseTracker
                render={({ x, y }) => (
                    <p>
                        鼠标位置: {x}, {y}
                    </p>
                )}
            />
        </div>
    );
}

function MouseTracker({ render }) {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        setPosition({ x: event.clientX, y: event.clientY });
    };

    return (
        <div
            style={{ height: '100vh', border: '1px solid red' }}
            onMouseMove={handleMouseMove}
        >
            {render(position)}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
