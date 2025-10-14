import React from './react';
import ReactDOM from './react-dom/client';

class ChildComponent extends React.Component {
    greet = () => {
        console.log('Hello From Child Component!');
    };

    render() {
        return <div>Child Component</div>;
    }
}

class ParentComponent extends React.Component {
    childRef = React.createRef();

    handleBtnClick = () => {
        this.childRef.current.greet();
    };

    render() {
        return (
            <div>
                <ChildComponent ref={this.childRef} />
                <button onClick={this.handleBtnClick}>
                    Click Me To Focus Child Component
                </button>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ParentComponent />);
