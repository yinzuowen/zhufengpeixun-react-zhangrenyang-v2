import { REACT_TEXT, REACT_FORWARD_REF } from '../constants';
import { isUndefined, wrapToArray } from '../utils';
import setupEventDelegation from './event';

function createRoot(container) {
    const root = {
        render(rootVdom) {
            mountVdom(rootVdom, container);
            setupEventDelegation(container);
        },
    };

    return root;
}

function mountVdom(vdom, parentDOM) {
    const domElement = createDOMElement(vdom);

    if (!domElement) {
        return;
    }

    parentDOM.appendChild(domElement);
}

export function createDOMElement(vdom) {
    if (isUndefined(vdom)) {
        return null;
    }

    const { type } = vdom;

    if (type.$$typeof === REACT_FORWARD_REF) {
        return createDOMElementFromForwardRefComponent(vdom);
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

function createDOMElementFromTextComponent(vdom) {
    const { props } = vdom;
    return document.createTextNode(props);
}

function createDOMElementFromClassComponent(vdom) {
    const { type, props, ref } = vdom;
    const instance = new type(props);
    if (ref) {
        ref.current = instance;
    }
    vdom.instance = instance;
    const renderVdom = instance.render();
    // 将渲染的 vdom 赋值给 instance 的 oldRenderVdom 属性
    instance.oldRenderVdom = renderVdom;
    return createDOMElement(renderVdom);
}

function createDOMElementFromFunctionComponent(vdom) {
    const { type, props } = vdom;
    const renderVdom = type(props);
    // 将渲染的 vdom 赋值给 vdom 的 oldRenderVdom 属性
    vdom.oldRenderVdom = renderVdom;
    return createDOMElement(renderVdom);
}

function createDOMElementFromForwardRefComponent(vdom) {
    const { type, props, ref } = vdom;
    const renderVdom = type.render(props, ref);
    // 将渲染的 vdom 赋值给 vdom 的 oldRenderVdom 属性
    vdom.oldRenderVdom = renderVdom;
    return createDOMElement(renderVdom);
}

function createDOMElementFromNativeComponent(vdom) {
    const { type, props, ref } = vdom;
    const domElement = document.createElement(type);
    updateProps(domElement, {}, props);
    mountChildren(vdom, domElement);
    if (ref) {
        ref.current = domElement;
    }
    vdom.domElement = domElement;
    return domElement;
}

function updateProps(domElement, oldProps = {}, newProps = {}) {
    Object.keys(newProps).forEach((key) => {
        if (key === 'children') {
            return;
        }

        if (key === 'style') {
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

/**
 * 获取虚拟DOM对应的真实DOM元素
 */
export function getDOMElementByVdom(vdom) {
    if (isUndefined(vdom)) {
        return null;
    }

    const { type } = vdom;

    if (typeof type === 'function') {
        // 类组件
        if (type.isReactComponent) {
            return getDOMElementByVdom(vdom.instance.oldRenderVdom);
        }

        // 函数组件
        return getDOMElementByVdom(vdom.oldRenderVdom);
    }

    return vdom.domElement;
}

const ReactDOM = {
    createRoot,
};

export default ReactDOM;
