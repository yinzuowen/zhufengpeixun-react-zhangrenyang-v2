import { REACT_TEXT } from '../constants';
import { isUndefined, wrapToArray } from '../utils';

function createRoot(container) {
    const root = {
        render(rootVdom) {
            mountVdom(rootVdom, container);
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

function createDOMElement(vdom) {
    if (isUndefined(vdom)) {
        return null;
    }

    const { type } = vdom;

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
    const { type, props } = vdom;
    const instance = new type(props);
    const renderVdom = instance.render();
    return createDOMElement(renderVdom);
}

function createDOMElementFromFunctionComponent(vdom) {
    const { type, props } = vdom;
    const renderVdom = type(props);
    return createDOMElement(renderVdom);
}

function createDOMElementFromNativeComponent(vdom) {
    const { type, props } = vdom;
    const domElement = document.createElement(type);
    updateProps(domElement, {}, props);
    mountChildren(vdom, domElement);
    return domElement;
}

function updateProps(domElement, oldProps = {}, newProps = {}) {
    Object.keys(newProps).forEach((key) => {
        if (key === 'children') {
            return;
        }

        if (key === 'style') {
            Object.assign(domElement.style, newProps[key]);
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

const ReactDOM = {
    createRoot,
};

export default ReactDOM;
