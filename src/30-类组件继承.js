import React from 'react';
import ReactDOM from 'react-dom/client';

class BaseComponent extends React.Component {
    static sharedStaticProp = 'sharedStaticProp';

    constructor(props) {
        super(props);
        this.state = {
            sharedState: 'initialState',
        };
    }

    sharedMethod() {
        console.log('sharedMethod called');
    }

    render() {
        return (
            <div>
                <h2>BaseComponent</h2>
                <p>sharedStaticProp: {this.constructor.sharedStaticProp}</p>
                <p>sharedState: {this.state.sharedState}</p>
            </div>
        );
    }
}

class DerivedComponent extends BaseComponent {
    componentDidMount() {
        this.sharedMethod();
    }
    render() {
        return (
            <div>
                <h2>DerivedComponent</h2>
                <p>sharedStaticProp: {this.constructor.sharedStaticProp}</p>
                <p>sharedState: {this.state.sharedState}</p>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<DerivedComponent />);
