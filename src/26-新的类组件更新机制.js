import React from './react';
import ReactDOM from './react-dom/client';

class App extends React.Component {
    render() {
        return (
            <div>
                <Count />
            </div>
        );
    }
}

class Count extends React.Component {
    state = {
        count: 0,
    };

    handleClick = () => {
        this.setState({
            count: this.state.count + 1,
        });
        console.log(this.state.count);
        this.setState({
            count: this.state.count + 1,
        });
        console.log(this.state.count);
        setTimeout(() => {
            this.setState({
                count: this.state.count + 1,
            });
            console.log(this.state.count);
            this.setState({
                count: this.state.count + 1,
            });
            console.log(this.state.count);
        });
    };

    render() {
        return (
            <button onClick={this.handleClick}>Count ({this.state.count}) + 1</button>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
