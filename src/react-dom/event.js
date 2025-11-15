import { scheduleUpdate } from '../react';

const eventTypeMethods = {
    click: {
        capture: 'onClickCapture',
        bubble: 'onClick',
    },
};

const phases = ['capture', 'bubble'];

function createSyntheticEvent(nativeEvent) {
    let isDefaultPrevented = false;
    let isPropagationStopped = false;
    let isImmediatePropagationStopped = false;

    const target = {
        nativeEvent,
        preventDefault() {
            if (nativeEvent.preventDefault) {
                nativeEvent.preventDefault();
            } else {
                nativeEvent.returnValue = false;
            }

            isDefaultPrevented = true;
        },
        stopPropagation() {
            if (nativeEvent.stopPropagation) {
                nativeEvent.stopPropagation();
            } else {
                nativeEvent.cancelBubble = true;
            }

            isPropagationStopped = true;
        },
        stopImmediatePropagation() {
            if (nativeEvent.stopImmediatePropagation) {
                nativeEvent.stopImmediatePropagation();
            } else {
                nativeEvent.cancelBubble = true;
            }

            isImmediatePropagationStopped = true;
        },
        isDefaultPrevented() {
            return isDefaultPrevented;
        },
        isPropagationStopped() {
            return isPropagationStopped;
        },
        isImmediatePropagationStopped() {
            return isImmediatePropagationStopped;
        },
    };

    const handler = {
        get(target, key) {
            let value;

            if (target.hasOwnProperty(key)) {
                value = Reflect.get(target, key);
            } else {
                value = Reflect.get(nativeEvent, key);
            }

            return typeof value === 'function'
                ? value.bind(nativeEvent)
                : value;
        },
    };

    const syntheticEvent = new Proxy(target, handler);

    return syntheticEvent;
}

function setupEventDelegation(container) {
    Reflect.ownKeys(eventTypeMethods).forEach((eventType) => {
        phases.forEach((phase) => {
            container.addEventListener(
                eventType,
                (nativeEvent) => {
                    const syntheticEvent = createSyntheticEvent(nativeEvent);

                    const composedPath = nativeEvent.composedPath();

                    const domElements =
                        phase === 'capture'
                            ? composedPath.reverse()
                            : composedPath;

                    const methodName = eventTypeMethods[eventType][phase];

                    // syntheticEvent 的 target 属性是不变的，点击哪个元素就是哪个元素
                    for (let domElement of domElements) {
                        if (syntheticEvent.isPropagationStopped()) {
                            break;
                        }

                        // syntheticEvent 的 currentTarget 属性是会变的，在哪个元素上执行事件回调函数，就是哪个元素
                        syntheticEvent.currentTarget = domElement;

                        domElement.reactEvents?.[methodName]?.(syntheticEvent);
                    }

                    // 调度更新
                    scheduleUpdate();
                },
                phase === 'capture',
            );
        });
    });
}

export default setupEventDelegation;
