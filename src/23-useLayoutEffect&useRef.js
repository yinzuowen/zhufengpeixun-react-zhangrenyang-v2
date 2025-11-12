import React from './react';
import ReactDOM from './react-dom/client';

const styleObj = {
    width: '100px',
    height: '100px',
    backgroundColor: 'red',
    borderRadius: '50%',
};

function Animation() {
    const ref = React.useRef(null);

    React.useLayoutEffect(() => {
        ref.current.style.transform = 'translateX(100px)';
        ref.current.style.transition = 'all 1s ease-in-out';
    }, []);

    return <div style={styleObj} ref={ref} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Animation />);
