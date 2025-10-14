import React from './react';
import ReactDOM from './react-dom/client';

/**
 * 在 React 17 中
 *   - 在生命周期函数、合成事件处理函数等 React 能够管理到的地方，setState 是异步（批量处理）的
 *   - 在 setTimeout 等 React 无法管理到的地方，setState 是同步的
 *  
 * 在 React 18 中
 *   - setState 是同步的
 */
class Counter extends React.Component {
    state = {
        count: 0,
    };

    handleClick = () => {
        this.setState({
            count: this.state.count + 1,
        });
        console.log(this.state);

        this.setState({
            count: this.state.count + 1,
        });
        console.log(this.state);

        setTimeout(() => {
            this.setState({
                count: this.state.count + 1,
            });
            console.log(this.state);

            this.setState({
                count: this.state.count + 1,
            });
            console.log(this.state);
        }, 0);
    };

    render() {
        return (
            <button onClick={this.handleClick}>
                Counter: {this.state.count}
            </button>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Counter />);
