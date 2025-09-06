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

const React = {
    createElement,
};

export default React;
