import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {InvalidPasswordError, UserNotFoundError} from "../utils/errors.js";

const SECRET_KEY = 'secret_key';
// dummy, de luat din database
const users = [
    {
        id: 1,
        username: 'user1',
        password: bcrypt.hashSync('password1', 8)
    }
];

export const login = async (req, res) => {
    const {username, password} = req.body;
    const user = users.find(u => u.username === username);

    if (!user) {
        throw new UserNotFoundError();
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        throw new InvalidPasswordError();
    }

    const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: 86401});

    res.jsonBody = {
        auth: true,
        token
    }
    res.statusCode = 200;
    req.handled = true;
}