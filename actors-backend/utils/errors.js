export class APIError extends Error {
    constructor(message, name = "APIError", statusCode = 500) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

export class ServerError extends APIError {
    constructor(message) {
        super(message, "500", 500);
    }
}

export class NotFoundError extends APIError {
    constructor(message) {
        super(message, "NotFoundError", 404);
    }
}

export class ForbiddenError extends APIError {
    constructor(message) {
        super(message, "ForbiddenError", 403);
    }
}

export class UnauthorizedError extends APIError {
    constructor(message) {
        super(message, "UnauthorizedError", 401);
    }
}

export class InvalidCsvError extends APIError {
    constructor(message) {
        super(message, "InvalidCsvError", 400);
    }
}

export class InvalidActorName extends APIError {
    constructor() {
        super("Actor name must be a string with length greater than 0", "InvalidActorName", 400);
    }
}

export class InvalidShowName extends APIError {
    constructor() {
        super("Show name must be a string with length greater than 0", "InvalidShowName", 400);
    }
}

export class InvalidAwardName extends APIError {
    constructor() {
        super("Award name must be a string with length greater than 5", "InvalidAwardName", 400);
    }
}

export class InvalidAwardYear extends APIError {
    constructor() {
        super("Year name must be a string", "InvalidAwardYear", 400);
    }
}

export class InvalidAwardType extends APIError {
    constructor() {
        super("The award type must be the strings: 'actor' or 'show'", "InvalidAwardType", 400);
    }
}

export class InvalidInteger extends APIError {
    constructor(message) {
        super(message, "InvalidInteger", 400);
    }
}

export class InvalidBoolean extends APIError {
    constructor(message) {
        super(message, "InvalidBoolean", 400);
    }
}