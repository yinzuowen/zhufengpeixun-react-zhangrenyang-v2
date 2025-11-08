import { REACT_TEXT, REACT_FORWARD_REF, REACT_MEMO } from '../constants';
import { isDefined, isUndefined, shallowEqual, wrapToArray } from '../utils';
import setupEventDelegation from './event';

let currentRoot = null;
let currentRootVdom = null;
let currentVdom = null;

function createRoot(container) {
    const root = {
        render(rootVdom) {
            currentRoot = root;
            currentRootVdom = rootVdom;
            mountVdom(rootVdom, container);
            setupEventDelegation(container);
        },
        update() {
            compareVdom(container, currentRootVdom, currentRootVdom);
        },
    };

    return root;
}

function mountVdom(vdom, parentDOM, nextDOMElement) {
    const domElement = createDOMElement(vdom);

    if (!domElement) {
        return;
    }

    if (nextDOMElement) {
        parentDOM.insertBefore(domElement, nextDOMElement);
    } else {
        parentDOM.appendChild(domElement);
    }

    // 组件已经被挂载
    domElement.componentDidMount?.();
}

export function createDOMElement(vdom) {
    if (isUndefined(vdom)) {
        return null;
    }

    const { type } = vdom;

    if (type.$$typeof === REACT_FORWARD_REF) {
        return createDOMElementFromForwardRefComponent(vdom);
    }

    if (type.$$typeof === REACT_MEMO) {
        return createDOMElementFromMemoComponent(vdom);
    }

    if (type === REACT_TEXT) {
        return createDOMElementFromTextComponent(vdom);
    }

    if (typeof type === 'function') {
        if (type.isReactComponent) {
            return createDOMElementFromClassComponent(vdom);
        }

        return createDOMElementFromFunctionComponent(vdom);
    }

    return createDOMElementFromNativeComponent(vdom);
}

function createDOMElementFromForwardRefComponent(vdom) {
    const { type, props, ref } = vdom;
    const renderVdom = type.render(props, ref);
    // 将渲染的 vdom 赋值给 vdom 的 oldRenderVdom 属性
    vdom.oldRenderVdom = renderVdom;
    return createDOMElement(renderVdom);
}

function createDOMElementFromTextComponent(vdom) {
    const { props } = vdom;
    const domElement = document.createTextNode(props);
    // 将创建的 DOM 元素赋值给 vdom 的 domElement 属性
    vdom.domElement = domElement;
    return domElement;
}

function createDOMElementFromMemoComponent(vdom) {
    const { type, props } = vdom;
    const renderVdom = type.render(props);
    vdom.oldRenderVdom = renderVdom;
    return createDOMElement(renderVdom);
}

function createDOMElementFromClassComponent(vdom) {
    const { type, props, ref } = vdom;
    const instance = new type(props);
    // 组件将要被挂载
    instance.componentWillMount?.();
    if (type.contextType) {
        instance.context = type.contextType._currentValue;
    }
    if (ref) {
        ref.current = instance;
    }
    vdom.instance = instance;
    const renderVdom = instance.render();
    // 将渲染的 vdom 赋值给 instance 的 oldRenderVdom 属性
    instance.oldRenderVdom = renderVdom;
    const domElement = createDOMElement(renderVdom);
    if (instance.componentDidMount) {
        domElement.componentDidMount =
            instance.componentDidMount.bind(instance);
    }
    return domElement;
}

function createDOMElementFromFunctionComponent(vdom) {
    vdom.hooks = {
        hookIndex: 0,
        hookStates: [],
    };
    currentVdom = vdom;
    const { type, props } = vdom;
    const renderVdom = type(props);
    // 将渲染的 vdom 赋值给 vdom 的 oldRenderVdom 属性
    vdom.oldRenderVdom = renderVdom;
    return createDOMElement(renderVdom);
}

function createDOMElementFromNativeComponent(vdom) {
    const { type, props, ref } = vdom;
    const domElement = document.createElement(type);
    if (ref) {
        ref.current = domElement;
    }
    updateProps(domElement, {}, props);
    mountChildren(vdom, domElement);
    vdom.domElement = domElement;
    return domElement;
}

function updateProps(domElement, oldProps = {}, newProps = {}) {
    Object.keys(oldProps).forEach((key) => {
        if (key === 'children') {
            // 啥都不干
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(newProps, key)) {
            if (key === 'style') {
                Object.keys(oldProps[key]).forEach((styleKey) => {
                    domElement.style[styleKey] = null;
                });
            } else if (key.startsWith('on')) {
                delete domElement.reactEvents[key];
            } else {
                delete domElement[key];
            }
        }
    });

    Object.keys(newProps).forEach((key) => {
        if (key === 'children') {
            // 啥都不干
        } else if (key === 'style') {
            Object.assign(domElement.style, newProps[key]);
        } else if (key.startsWith('on')) {
            if (!domElement.reactEvents) {
                domElement.reactEvents = {};
            }

            domElement.reactEvents[key] = newProps[key];
        } else {
            domElement[key] = newProps[key];
        }
    });
}

function mountChildren(vdom, domElement) {
    const children = wrapToArray(vdom?.props?.children);
    children.forEach((child) => {
        mountVdom(child, domElement);
    });
}

export function compareVdom(parentDOM, oldVdom, newVdom, nextDOMElement) {
    if (isDefined(oldVdom) && isDefined(newVdom)) {
        if (oldVdom.type === newVdom.type) {
            // 更新 DOM 节点
            updateVdom(oldVdom, newVdom);
        } else {
            // 卸载旧的 DOM 节点, 挂载新的 DOM 节点
            unmountVdom(oldVdom);
            mountVdom(newVdom, parentDOM, nextDOMElement);
        }
    } else if (isDefined(oldVdom) && isUndefined(newVdom)) {
        // 卸载旧的 DOM 节点
        unmountVdom(oldVdom);
    } else if (isUndefined(oldVdom) && isDefined(newVdom)) {
        // 挂载新的 DOM 节点
        mountVdom(newVdom, parentDOM, nextDOMElement);
    }
}

function unmountVdom(vdom) {
    if (isUndefined(vdom)) {
        return;
    }

    const { props, instance, ref } = vdom;

    instance?.componentWillUnmount?.();

    const children = wrapToArray(props?.children);

    children.forEach((child) => {
        unmountVdom(child);
    });

    if (ref) {
        ref.current = null;
    }

    const domElement = getDOMElementByVdom(vdom);

    domElement?.remove();
}

function updateVdom(oldVdom, newVdom) {
    const { type } = oldVdom;

    if (type.$$typeof === REACT_FORWARD_REF) {
        return updateReactForwardRefComponent(oldVdom, newVdom);
    } else if (type.$$typeof === REACT_MEMO) {
        return updateReactMemoComponent(oldVdom, newVdom);
    } else if (type === REACT_TEXT) {
        return updateReactTextComponent(oldVdom, newVdom);
    } else if (typeof type === 'function') {
        if (type.isReactComponent) {
            return updateClassComponent(oldVdom, newVdom);
        } else {
            return updateFunctionComponent(oldVdom, newVdom);
        }
    } else if (typeof type === 'string') {
        return updateNativeComponent(oldVdom, newVdom);
    }
}

function updateReactForwardRefComponent(oldVdom, newVdom) {
    const { type, props, ref } = newVdom;
    const newRenderVdom = type.render(props, ref);
    compareVdom(
        getParentDOMByVdom(oldVdom),
        oldVdom.oldRenderVdom,
        newRenderVdom,
    );
}

function updateReactMemoComponent(oldVdom, newVdom) {
    const { type, props } = newVdom;
    const { render, compare } = type;
    if (compare(oldVdom.props, props)) {
        newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
        return;
    }
    const newRenderVdom = render(props);
    compareVdom(
        getParentDOMByVdom(oldVdom),
        oldVdom.oldRenderVdom,
        newRenderVdom,
    );
    newVdom.oldRenderVdom = newRenderVdom;
}

function updateReactTextComponent(oldVdom, newVdom) {
    const domElement = getDOMElementByVdom(oldVdom);
    if (oldVdom.props !== newVdom.props) {
        domElement.textContent = newVdom.props;
    }
    newVdom.domElement = domElement;
}

function updateClassComponent(oldVdom, newVdom) {
    const instance = oldVdom.instance;
    newVdom.instance = instance;
    instance.componentWillReceiveProps?.(newVdom.props);
    instance.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
    const hooks = (newVdom.hooks = oldVdom.hooks);
    hooks.hookIndex = 0;
    currentVdom = newVdom;
    const { type, props } = newVdom;
    const newRenderVdom = type(props);
    compareVdom(
        getParentDOMByVdom(oldVdom),
        oldVdom.oldRenderVdom,
        newRenderVdom,
    );
    newVdom.oldRenderVdom = newRenderVdom;
}

function updateNativeComponent(oldVdom, newVdom) {
    const domElement = getDOMElementByVdom(oldVdom);
    newVdom.domElement = domElement;
    updateProps(domElement, oldVdom.props, newVdom.props);
    updateChildren(domElement, oldVdom.props.children, newVdom.props.children);
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
    oldVChildren = wrapToArray(oldVChildren);
    newVChildren = wrapToArray(newVChildren);

    let lastPlacedNode = null;

    function placeChildElement(domElement) {
        if (isDefined(lastPlacedNode)) {
            if (lastPlacedNode.nextSibling !== domElement) {
                parentDOM.insertBefore(domElement, lastPlacedNode.nextSibling);
            }
        } else {
            parentDOM.insertBefore(domElement, parentDOM.firstChild);
        }

        lastPlacedNode = domElement;
    }

    for (let index = 0; index < newVChildren.length; index++) {
        const newVChild = newVChildren[index];

        if (newVChild) {
            const oldVChildIndex = oldVChildren.findIndex((oldVChild) =>
                isSameVNode(oldVChild, newVChild),
            );

            if (oldVChildIndex > -1) {
                const oldVChild = oldVChildren[oldVChildIndex];
                updateVdom(oldVChild, newVChild);
                const oldDOMElement = getDOMElementByVdom(oldVChild);
                placeChildElement(oldDOMElement);
                oldVChildren.splice(oldVChildIndex, 1);
            } else {
                const newDOMElement = createDOMElement(newVChild);
                placeChildElement(newDOMElement);
            }
        }
    }

    oldVChildren.forEach((oldVChild) => {
        if (oldVChild) {
            // unmountVdom(oldVChild);
            const domElement = getDOMElementByVdom(oldVChild);
            if (domElement) {
                domElement.remove();
            }
        }
    });
}

/**
 * 判断两个虚拟 DOM 节点是否相同
 */
function isSameVNode(oldVNode, newVNode) {
    return (
        isDefined(oldVNode) &&
        isDefined(newVNode) &&
        oldVNode.type === newVNode.type &&
        oldVNode.key === newVNode.key
    );
}

/**
 * 获取下一个真实 DOM 元素
 */
function getNextDOMElement(vChildren, startIndex) {
    for (let i = startIndex; i < vChildren.length; i++) {
        const domElement = getDOMElementByVdom(vChildren[i]);
        if (domElement) {
            return domElement;
        }
    }
    return null;
}

/**
 * 获取虚拟 DOM 对应的真实 DOM 元素的父级 DOM 元素
 */
export function getParentDOMByVdom(vdom) {
    const domElement = getDOMElementByVdom(vdom);
    return domElement?.parentNode;
}

/**
 * 获取虚拟 DOM 对应的真实 DOM 元素
 */
export function getDOMElementByVdom(vdom) {
    if (isUndefined(vdom)) {
        return null;
    }

    const { type } = vdom;

    if (typeof type === 'function' || typeof type.render === 'function') {
        // 类组件
        if (type.isReactComponent) {
            return getDOMElementByVdom(vdom.instance.oldRenderVdom);
        }

        // 函数组件
        return getDOMElementByVdom(vdom.oldRenderVdom);
    }

    return vdom.domElement;
}

export function useReducer(reducer, initialState) {
    const { hooks } = currentVdom;
    const { hookIndex, hookStates } = hooks;
    const hookState = hookStates[hookIndex];
    if (isUndefined(hookState)) {
        // 第一次挂载，赋默认状态
        hookStates[hookIndex] = initialState;
    }
    function dispatch(action) {
        const oldState = hookStates[hookIndex];
        const newState = reducer(oldState, action);

        if (!shallowEqual(newState, oldState)) {
            hookStates[hookIndex] = newState;
            currentRoot.update();
        }
    }
    hooks.hookIndex++;
    return [hookStates[hookIndex], dispatch];
}

const defaultReducer = (state, action) => {
    if (typeof action === 'function') {
        return action(state);
    }

    return action;
};

export function useState(initialState) {
    return useReducer(defaultReducer, initialState);
}

export function useMemo(factory, deps) {
    const { hooks } = currentVdom;
    const { hookIndex, hookStates } = hooks;

    const hookState = hookStates[hookIndex];

    // 存在，则更新
    if (hookState) {
        // 取出上一个memo和deps
        const [prevMemo, prevDeps] = hookState;

        // 对比deps
        if (deps.every((dep, index) => dep === prevDeps[index])) {
            hooks.hookIndex++;
            return prevMemo;
        }
    }

    // 不存在，则创建
    const memo = factory();
    hookStates[hookIndex] = [memo, deps];
    hooks.hookIndex++;
    return memo;
}

export function useCallback(callback, deps) {
    return useMemo(() => callback, deps);
}

const ReactDOM = {
    createRoot,
};

export default ReactDOM;
