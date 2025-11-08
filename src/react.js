import { REACT_FORWARD_REF, REACT_MEMO } from './constants';
import { isDefined, wrapToVdom, shallowEqual } from './utils';
import {
    compareVdom,
    getParentDOMByVdom,
    useReducer,
} from './react-dom/client';

let isBatchingUpdate = false; // 是否处于批量更新模式

const dirtyComponents = new Set(); // 有待更新的组件集合

export function setIsBatchingUpdate(value) {
    isBatchingUpdate = value;
}

/**
 * 刷新有待更新的组件
 */
export function flushDirtyComponents() {
    dirtyComponents.forEach((component) => {
        component.updateIfNeeded();
    });
    dirtyComponents.clear();
    isBatchingUpdate = false;
}

function createElement(type, config, children) {
    delete config.__self;
    delete config.__source;

    const { key, ref, ...props } = config;

    if (arguments.length > 3) {
        props.children = Array.prototype.slice
            .call(arguments, 2)
            .map(wrapToVdom);
    } else {
        props.children = wrapToVdom(children);
    }

    return {
        type,
        props,
        ref,
        key,
    };
}

function createRef() {
    return {
        current: null,
    };
}

/**
 * render: 函数组件
 */
function forwardRef(render) {
    return {
        $$typeof: REACT_FORWARD_REF,
        render,
    };
}

function createContext(defaultValue) {
    const context = {
        _currentValue: defaultValue,
        Provider: (props) => {
            context._currentValue = props.value;
            return props.children;
        },
        Consumer: (props) => {
            return props.children(context._currentValue);
        },
    };

    return context;
}

class Component {
    static isReactComponent = true;

    constructor(props) {
        this.props = props;
        this.pendingStates = [];
        this.nextProps = null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    setState(partialState, callback) {
        // 如果处于批量更新模式
        if (isBatchingUpdate) {
            // 将组件添加到 dirtyComponents 中
            dirtyComponents.add(this);

            // 将 partialState 添加到 pendingStates 中
            this.pendingStates.push(partialState);
        } else {
            const newState =
                typeof partialState === 'function'
                    ? partialState(this.state)
                    : partialState;

            this.state = {
                ...this.state,
                ...newState,
            };

            this.updateIfNeeded();

            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    updateIfNeeded() {
        let nextState = this.accumulateState();
        if (this.constructor.getDerivedStateFromProps) {
            const derivedState = this.constructor.getDerivedStateFromProps(
                this.nextProps,
                this.state,
            );
            if (isDefined(derivedState)) {
                nextState = {
                    ...nextState,
                    ...derivedState,
                };
            }
        }
        this.state = nextState;
        const shouldUpdate = this.shouldComponentUpdate?.(
            this.nextProps,
            nextState,
        );
        if (this.nextProps) {
            this.props = this.nextProps;
            this.nextProps = null;
        }
        if (shouldUpdate) {
            this.forceUpdate();
        }
    }

    accumulateState = () => {
        const newState = this.pendingStates.reduce((state, partialState) => {
            const newState =
                typeof partialState === 'function'
                    ? partialState(state)
                    : partialState;

            return {
                ...state,
                ...newState,
            };
        }, this.state);

        this.pendingStates.length = 0;

        return newState;
    };

    forceUpdate() {
        this.componentWillUpdate?.();
        if (this.constructor.contextType) {
            this.context = this.constructor.contextType._currentValue;
        }
        const newRenderVdom = this.render();
        const parentDOM = getParentDOMByVdom(this.oldRenderVdom);
        const snapshot = this.getSnapshotBeforeUpdate?.(this.props, this.state);
        compareVdom(parentDOM, this.oldRenderVdom, newRenderVdom);
        this.oldRenderVdom = newRenderVdom;
        this.componentDidUpdate?.(this.props, this.state, snapshot);
    }

    emitUpdate(nextProps) {
        this.nextProps = nextProps;
        if (this.nextProps || this.pendingStates.length > 0) {
            this.updateIfNeeded();
        }
    }
}

class PureComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(
            shallowEqual(this.props, nextProps) &&
            shallowEqual(this.state, nextState)
        );
    }
}

function memo(render, compare = shallowEqual) {
    return {
        $$typeof: REACT_MEMO,
        render,
        compare,
    };
}

const React = {
    createElement,
    createRef,
    createContext,
    forwardRef,
    Component,
    PureComponent,
    memo,
    useReducer,
};

export default React;
