import React from './react';
import ReactDOM from './react-dom/client';

const element = React.createElement(
    'div',
    {
        className: 'container',
        style: {
            color: 'red',
        },
    },
    'Hello, ',
    React.createElement(
        'span',
        {
            style: {
                color: 'green',
            },
        },
        'World!',
    ),
);

console.log(element);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(element);
