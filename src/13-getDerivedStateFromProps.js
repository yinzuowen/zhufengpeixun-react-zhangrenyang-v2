import React from './react';
import ReactDOM from './react-dom/client';

class ShoppingCart extends React.Component {
    state = {
        itemCount: this.props.itemCount,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps && nextProps.itemCount !== prevState.itemCount) {
            return {
                itemCount: nextProps.itemCount,
            };
        }

        return null;
    }

    render() {
        return (
            <div>
                <p>Items In Shopping Cart: {this.state.itemCount}</p>
            </div>
        );
    }
}

class App extends React.Component {
    state = {
        itemCount: 0,
    };

    handleAddItem = () => {
        this.setState({
            itemCount: this.state.itemCount + 1,
        });
    };

    render() {
        return (
            <div>
                <h1>Online Store</h1>
                <p>Items In Store: {this.state.itemCount}</p>
                <button onClick={this.handleAddItem}>Add Item</button>
                <ShoppingCart itemCount={this.state.itemCount} />
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
