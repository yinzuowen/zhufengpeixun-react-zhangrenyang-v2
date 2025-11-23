import React from 'react';
import ReactDOM from 'react-dom/client';

class ParentComponent extends React.Component {
    state = {
        text: 'loading...',
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                text: 'data loaded',
            });
        }, 3000);
    }

    render() {
        return (
            <div>
                <h1>Parent Component</h1>
                <ChildComponent text={this.state.text} />
            </div>
        );
    }
}

class ChildComponent extends React.Component {
    render() {
        return (
            <div>
                <h2>Child Component</h2>
                <p>{this.props.text}</p>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ParentComponent />);
