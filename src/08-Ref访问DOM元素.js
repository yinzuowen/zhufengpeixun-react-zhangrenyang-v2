import React from './react';
import ReactDOM from './react-dom/client';

class RefComponent extends React.Component {
    inputRef = React.createRef();

    handleBtnClick = () => {
        this.inputRef.current.focus();
    };

    render() {
        return (
            <div>
                <input ref={this.inputRef} />
                <button onClick={this.handleBtnClick}>
                    Click Me To Focus The Input
                </button>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<RefComponent />);
