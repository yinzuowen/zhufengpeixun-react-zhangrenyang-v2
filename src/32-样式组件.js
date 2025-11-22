import React from 'react';
import ReactDOM from 'react-dom/client';

function parseStyles(styles) {
    return styles.split(';').reduce((prev, next) => {
        const [key, value] = next.split(':');
        if (key && value) {
            prev[convertToCamelCase(key.trim())] = value;
        }
        return prev;
    }, {});
}

function convertToCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, letter) => {
        return letter.toUpperCase();
    });
}

const styled = {
    h1: ([styles]) => {
        return (props) => (
            <h1 {...props} style={parseStyles(styles)}>
                {props.children}
            </h1>
        );
    },
    button: ([styles]) => {
        return (props) => (
            <button {...props} style={parseStyles(styles)}>
                {props.children}
            </button>
        );
    },
};

const Title = styled.h1`
    color: red;
`;

const StyledButton = styled.button`
    background-color: green;
`;

function App() {
    return (
        <div>
            <Title>Hello, World!</Title>
            <StyledButton type="primary">Click Me</StyledButton>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
