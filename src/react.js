import { wrapToVdom } from './utils';
import { createDOMElement, getDOMElementByVdom } from './react-dom/client';

function createElement(type, config, children) {
    const props = { ...config };

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
    };
}

class Component {
    static isReactComponent = true;

    constructor(props) {
        this.props = props;
    }

    setState(partialState, callback) {
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

    forceUpdate() {
        const newRenderVdom = this.render();
        const newDOMElement = createDOMElement(newRenderVdom);
        // const oldDOMElement = this.oldRenderVdom.oldRenderVdom.domElement;
        const oldDOMElement = getDOMElementByVdom(this.oldRenderVdom);
        const parentDOM = oldDOMElement.parentNode;
        parentDOM.replaceChild(newDOMElement, oldDOMElement);
        this.oldRenderVdom = newRenderVdom;
    }
}

const React = {
    createElement,
    Component,
};

export default React;
