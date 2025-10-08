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
        isDefaultPrevented() {
            return isDefaultPrevented;
        },
        isPropagationStopped() {
            return isPropagationStopped;
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

                    for (let domElement of domElements) {
                        if (syntheticEvent.isPropagationStopped()) {
                            break;
                        }

                        domElement.reactEvents?.[methodName]?.(syntheticEvent);
                    }
                },
                phase === 'capture',
            );
        });
    });
}

export default setupEventDelegation;
