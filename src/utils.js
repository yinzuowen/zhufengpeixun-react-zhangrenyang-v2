import { REACT_TEXT } from './constants';

export function isUndefined(value) {
    return value === undefined || value === null;
}

export function isDefined(value) {
    return value !== undefined && value !== null;
}

export function wrapToArray(value) {
    return Array.isArray(value) ? value.flat() : [value];
}

export function wrapToVdom(element) {
    if (typeof element === 'string' || typeof element === 'number') {
        return {
            type: REACT_TEXT,
            props: element,
        };
    }

    return element;
}
