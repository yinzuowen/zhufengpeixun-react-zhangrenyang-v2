import React from './react';
import ReactDOM from './react-dom/client';

class ClassComponent extends React.Component {
    parentBubble() {
        console.log('React父节点在冒泡阶段执行');
    }

    childBubble(event) {
        console.log('React子节点在冒泡阶段执行');
        event.stopPropagation();
    }

    parentCapture(event) {
        console.log('React父节点在捕获阶段执行');
        // event.stopPropagation();

    }

    childCapture() {
        console.log('React子节点在捕获阶段执行');
    }

    render() {
        return (
            <div
                id="parent"
                onClick={this.parentBubble}
                onClickCapture={this.parentCapture}
            >
                <div>Hello, {this.props.name}!</div>
                <div
                    id="child"
                    onClick={this.childBubble}
                    onClickCapture={this.childCapture}
                >
                    Click me
                </div>
            </div>
        );
    }
}

const classComponent = <ClassComponent name="React" />;

console.log(classComponent);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(classComponent);

setTimeout(() => {
    const root = document.getElementById('root');
    const parent = document.querySelector('#parent');
    const child = document.querySelector('#child');

    root.addEventListener('click', () => {
        console.log('    Native根节点在冒泡阶段执行');
    });

    parent.addEventListener('click', () => {
        console.log('    Native父节点在冒泡阶段执行');
    });

    child.addEventListener('click', () => {
        console.log('    Native子节点在冒泡阶段执行');
    });

    root.addEventListener(
        'click',
        () => {
            console.log('    Native根节点在捕获阶段执行');
        },
        true,
    );

    parent.addEventListener(
        'click',
        () => {
            console.log('    Native父节点在捕获阶段执行');
        },
        true,
    );

    child.addEventListener(
        'click',
        () => {
            console.log('    Native子节点在捕获阶段执行');
        },
        true,
    );
}, 1000);
