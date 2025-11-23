import React from 'react';
import ReactDOM from 'react-dom/client';

class ParentComponent extends React.Component {
    state = {
        data: '',
    };
    handleData = (data) => {
        this.setState({
            data,
        });
    };
    render() {
        return (
            <div>
                <h1>Parent Component</h1>
                <p>Data from child: {this.state.data}</p>
                <ChildComponent1
                    data={this.state.data}
                    dataChanged={this.handleData}
                />
                <ChildComponent2
                    data={this.state.data}
                    dataChanged={this.handleData}
                />
            </div>
        );
    }
}

class ChildComponent1 extends React.Component {
    render() {
        return (
            <div>
                <p>Data: {this.props.data}</p>
                <button
                    onClick={() => this.props.dataChanged('data from child1')}
                >
                    Send Data To ParentComponent
                </button>
            </div>
        );
    }
}

class ChildComponent2 extends React.Component {
    render() {
        return (
            <div>
                <p>Data: {this.props.data}</p>
                <button
                    onClick={() => this.props.dataChanged('data from child2')}
                >
                    Send Data To ParentComponent
                </button>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ParentComponent />);
