function createElement(type, config, children) {
    const props = { ...config };

    if (arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments, 2);
    } else {
        props.children = children;
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
}

const React = {
    createElement,
    Component,
};

export default React;
