export class APIError extends Error {
    constructor(message, name = "APIError", statusCode = 500) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
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