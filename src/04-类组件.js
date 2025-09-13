import React from './react';
import ReactDOM from './react-dom/client';

class ClassComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div style={{ color: 'red' }}>Hello, {this.props.name}!</div>;
    }
}

const classComponent = <ClassComponent name="React" />;

console.log(classComponent);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(classComponent);
