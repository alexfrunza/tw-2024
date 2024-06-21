import {InvalidActorName} from "./errors.js";

export const validateActorName = (name) => {
    if (!name || typeof name !== 'string' || name.length < 5) {
        throw new InvalidActorName();
    }
}