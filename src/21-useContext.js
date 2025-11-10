import React from './react';
import ReactDOM from './react-dom/client';

const MyContext = React.createContext('default value');

function App() {
    return (
        <MyContext.Provider value="provider value">
            <Child />
        </MyContext.Provider>
    );
}

function Child() {
    const value = React.useContext(MyContext);
    return <div>Child: {value}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
