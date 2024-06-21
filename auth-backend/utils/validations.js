export function validateRegisterInput(username, email, firstName, lastName, password) {
    const errors = [];

    if (!username || typeof username !== 'string') {
        errors.push('Username is required and must be a string.');
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        errors.push('Email is required, must be a string, and must be a valid email address.');
    }

    if (!firstName || typeof firstName !== 'string') {
        errors.push('First name is required and must be a string.');
    }

    if (!lastName || typeof lastName !== 'string') {
        errors.push('Last name is required and must be a string.');
    }

    if (!password || typeof password !== 'string' || password.length < 5) {
        errors.push('Password is required, must be a string, and must be at least 5 characters long.');
    }

    return errors;
}