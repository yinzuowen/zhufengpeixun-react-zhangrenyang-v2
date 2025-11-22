import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from 'antd';

class ButtonWithLogging extends React.Component {
    handleClick = (event) => {
        console.log('Button clicked');
        this.props.onClick?.(event);
    };
    render() {
        return (
            <Button type="primary" {...this.props} onClick={this.handleClick} />
        );
    }
}

function App() {
    return <ButtonWithLogging type="primary">Click Me</ButtonWithLogging>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
