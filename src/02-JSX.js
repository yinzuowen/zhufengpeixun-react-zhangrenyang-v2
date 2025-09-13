import React from './react';
import ReactDOM from './react-dom/client';

const jsxElement = (
    <div style={{ color: 'red' }}>
        Hello, 
        <span style={{ color: 'green' }}>React!</span>
    </div>
);

console.log(jsxElement);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(jsxElement);
