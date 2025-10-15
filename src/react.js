import { REACT_FORWARD_REF } from './constants';
import { wrapToVdom } from './utils';
import { createDOMElement, getDOMElementByVdom } from './react-dom/client';

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
        component.forceUpdate();
    });
    dirtyComponents.clear();
    isBatchingUpdate = false;
}

function createElement(type, config, children) {
    const { ref, ...props } = config;

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
    }
}

class Component {
    static isReactComponent = true;

    constructor(props) {
        this.props = props;
        this.pendingStates = [];
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

            this.forceUpdate();

            if (typeof callback === 'function') {
                callback();
            }
        }
    }

    forceUpdate() {
        this.state = this.accumulateState();
        const newRenderVdom = this.render();
        const newDOMElement = createDOMElement(newRenderVdom);
        const oldDOMElement = getDOMElementByVdom(this.oldRenderVdom);
        const parentDOM = oldDOMElement.parentNode;
        parentDOM.replaceChild(newDOMElement, oldDOMElement);
        this.oldRenderVdom = newRenderVdom;
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
}

const React = {
    createElement,
    createRef,
    forwardRef,
    Component,
};

export default React;
