import {
    InvalidActorName,
    InvalidAwardName,
    InvalidAwardType,
    InvalidAwardYear, InvalidBoolean,
    InvalidInteger,
    InvalidShowName
} from "./errors.js";

export const validateActorName = (name, optional = false) => {
    if (!name && optional) {
        return;
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new InvalidActorName();
    }
}

export const validateShowName = (name, optional = false) => {
    if (!name && optional) {
        return;
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new InvalidShowName();
    }
}

export const validateAwardName = (name) => {
    if (!name || typeof name !== 'string' || name.trim().length < 5) {
        throw new InvalidAwardName();
    }
}

export const validateAwardYear = (year, optional = false) => {
    if (!year && optional) {
        return;
    }

    if (!year || typeof year !== 'string' || year.trim().length === 0) {
        throw new InvalidAwardYear();
    }
}

export const validateAwardType = (type, optional = false) => {
    if (!type && optional) {
        return;
    }

    if (type !== 'actor' && type !== 'show') {
        throw new InvalidAwardType();
    }
}

export const validateInteger = (value, name) => {
    if (!Number.isInteger(value)) {
        throw new InvalidInteger("The value of " + name + " must be an integer");
    }
}

export const validateBoolean = (value, name) => {
    if (typeof value !== 'boolean') {
        throw new InvalidBoolean("The value of " + name + " must be a boolean");
    }
}
