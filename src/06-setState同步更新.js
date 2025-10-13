import React from './react';
import ReactDOM from './react-dom/client';

function ChildCounter(props) {
    return (
        <button onClick={props.handleClick}>
            child count: {props.state.count}
        </button>
    );
}

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    handleClick = () => {
        // this.setState({
        //     count: this.state.count + 1,
        // });
        this.setState(
            (prevState) => ({
                count: prevState.count + 1,
            }),
            () => {
                console.log('state updated:', this.state.count);
            },
        );
    };

    render() {
        return (
            <ChildCounter state={this.state} handleClick={this.handleClick} />
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Counter />);
