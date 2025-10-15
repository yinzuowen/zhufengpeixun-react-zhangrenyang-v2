import React from './react';
import ReactDOM from './react-dom/client';

function ChildComponent(props, forwardRef) {
    return <input ref={forwardRef} />;
}

const ForwardedChildComponent = React.forwardRef(ChildComponent);

class ParentComponent extends React.Component {
    childRef = React.createRef();

    handleBtnClick = () => {
        this.childRef.current.focus();
    };

    render() {
        return (
            <div>
                <ForwardedChildComponent ref={this.childRef} />
                <button onClick={this.handleBtnClick}>
                    Click Me To Focus Child Component
                </button>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<ParentComponent />);
