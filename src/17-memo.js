import React from './react';
import ReactDOM from './react-dom/client';

class App extends React.Component {
    state = {
        count: 0,
    };
    increment = () => {
        this.setState((prevState) => ({
            count: prevState.count + 1
        }));
    };
    render() {
        return (
            <div>
                <MemoCounter count={this.state.count} />
                <button onClick={this.increment}>inc</button>
            </div>
        );
    }
}

function Counter(props) {
    console.log('Counter render');
    return <div>count: {props.count}</div>;
}

const MemoCounter = React.memo(Counter);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
