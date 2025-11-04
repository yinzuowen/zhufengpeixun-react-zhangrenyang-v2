import React from './react';
import ReactDOM from './react-dom/client';

class App extends React.Component {
    state = {
        data: {
            value: 1,
        },
    };
    render() {
        return (
            <div>
                <PlainComponent value={this.state.data.value} />
                <PureComponent value={this.state.data.value} />
                <button onClick={() => this.setState({ data: { value: 1 } })}>
                    +1
                </button>
            </div>
        );
    }
}

class PlainComponent extends React.Component {
    render() {
        console.log('PlainComponent render');
        return <div>PlainComponent: {this.props.value}</div>;
    }
}

class PureComponent extends React.PureComponent {
    render() {
        console.log('PureComponent render');
        return <div>PureComponent: {this.props.value}</div>;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
