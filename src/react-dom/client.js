function renderElement(element) {
    if (typeof element === 'string' || typeof element === 'number') {
        return document.createTextNode(element);
    }

    const { type, props } = element;

    if (typeof type === 'function') {
        const functionComponent = type(props);
        return renderElement(functionComponent);
    }

    const domElement = document.createElement(type);

    Object.keys(props).forEach((key) => {
        if (key === 'children') {
            return;
        }

        if (key === 'style') {
            Object.assign(domElement.style, props[key]);
        } else {
            domElement[key] = props[key];
        }
    });

    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];

    children.forEach((child) => {
        domElement.appendChild(renderElement(child));
    });

    return domElement;
}

function createRoot(container) {
    const root = {
        render(reactElement) {
            const domElement = renderElement(reactElement);
            container.appendChild(domElement);
        },
    };

    return root;
}

const ReactDOM = {
    createRoot,
};

export default ReactDOM;
