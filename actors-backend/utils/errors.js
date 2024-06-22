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
        super("Actor name must be a string with length greater than 5", "InvalidActorName", 400);
    }
}

export class InvalidShowName extends APIError {
    constructor() {
        super("Show name must be a string with length greater than 5", "InvalidShowName", 400);
    }
}
