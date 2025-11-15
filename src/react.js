import { REACT_FORWARD_REF, REACT_MEMO } from './constants';
import { isDefined, wrapToVdom, shallowEqual } from './utils';
import {
    compareVdom,
    getParentDOMByVdom,
    currentRoot,
    useReducer,
    useState,
    useMemo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
} from './react-dom/client';

const dirtyComponents = new Set(); // 有待更新的组件集合

let isScheduledUpdate = false; // 是否已经调度了更新

export function scheduleUpdate() {
    if (isScheduledUpdate) {
        return;
    }

    isScheduledUpdate = true;

    queueMicrotask(() => {
        currentRoot?.update();
        isScheduledUpdate = false;
    });
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
        // 将 partialState 添加到 pendingStates 中
        this.pendingStates.push(partialState);

        // 调度更新
        scheduleUpdate();
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

function useContext(context) {
    return context._currentValue;
}

function useImperativeHandle(ref, factory) {
    ref.current = factory();
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
    useState,
    useMemo,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useImperativeHandle,
};

export default React;
