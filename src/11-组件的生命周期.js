import React from './react';
import ReactDOM from './react-dom/client';
/**
 * React类组件的生命周期可以分为三个阶段
 *   + 初始化阶段
 *     - constructor
 *   + 挂载阶段
 *     - componentWillMount 组件将要被挂载，在 React 18 中被废弃
 *     - render 计算将要渲染的虚拟DOM，纯函数，不能调用setState，也不能有副作用
 *     - componentDidMount 组件被挂载到真实DOM之后触发，在这里可以发起网络请求和订阅信息
 *   + 更新阶段 组件的props或state发生变化时触发
 *     - componentWillReceiveProps 组件将要接收新的props时触发
 *     - shouldComponentUpdate 组件是否需要更新，返回true则更新，返回false则不更新
 *     - componentWillUpdate 组件将要更新时触发
 *     - render 计算将要渲染的虚拟DOM，纯函数，不能调用setState，也不能有副作用
 *     - componentDidUpdate 组件更新到真实DOM之后触发，在这里可以发起网络请求和订阅信息
 *   + 卸载阶段 组件被卸载时触发
 *     - componentWillUnmount 组件将要被卸载时触发，在这里可以取消网络请求、取消订阅信息、清理定时器等
 */
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
        console.log('[parent]1-constructor');
    }
    componentWillMount() {
        console.log('[parent]2-componentWillMount');
    }
    componentDidMount() {
        console.log('[parent]4-componentDidMount');
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('[parent]5-shouldComponentUpdate');
        return nextState.count % 2 === 0;
    }
    componentWillUpdate(nextProps, nextState) {
        console.log('[parent]6-componentWillUpdate');
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('[parent]7-componentDidUpdate');
    }
    handleClick = () => {
        this.setState({
            count: this.state.count + 1,
        });
    };
    render() {
        console.log('[parent]3-render');

        return (
            <div>
                <p>count: {this.state.count}</p>
                {this.state.count === 4 ? null : (
                    <ChildCounter count={this.state.count} />
                )}
                <button onClick={this.handleClick}>+1</button>
            </div>
        );
    }
}

class ChildCounter extends React.Component {
    componentWillMount() {
        console.log('    [child]1-componentWillMount');
    }
    componentDidMount() {
        console.log('    [child]3-componentDidMount');
    }
    componentWillReceiveProps() {
        console.log('    [child]4-componentWillReceiveProps');
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('    [child]5-shouldComponentUpdate');
        return nextProps.count % 3 === 0;
    }
    componentWillUpdate(nextProps, nextState) {
        console.log('    [child]6-componentWillUpdate');
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('    [child]7-componentDidUpdate');
    }
    componentWillUnmount() {
        console.log('    [child]8-componentWillUnmount');
    }
    render() {
        console.log('    [child]2-render');
        return <div>child count: {this.props.count}</div>;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Counter />);
