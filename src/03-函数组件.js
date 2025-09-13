import React from './react';
import ReactDOM from './react-dom/client';

function FunctionComponent({ name }) {
    return <div style={{ color: 'red' }}>Hello, {name}!</div>;
}

const functionComponent = <FunctionComponent name="React" />;

console.log(functionComponent);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(functionComponent);
