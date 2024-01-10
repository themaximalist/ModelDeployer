import User from "../models/user.js"
import BaseManager from "./base.js"
import bcrypt from "bcrypt"

export default class Users extends BaseManager {

    constructor() {
        super(...arguments);
        this.Model = User;
    }

    async add(data) {
        return await this.update(User.build(), data);
    }

    async update(user, data) {
        user.email = data.email;

        if (data.password1 !== data.password2) { throw new Error("Passwords do not match") }
        if (!data.password1) { throw new Error("No password provided") }
        if (data.password1.length < 8) { throw new Error("Password must be at least 8 characters") }
        user.password = await bcrypt.hash(data.password1, 10);

        return await user.save();
    }

    async login(data) {
        const user = await this.Model.findOne({ where: { email: data.email } });
        if (!user) { throw new Error("Error logging in") }

        const isValid = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!isValid) { throw new Error("Error logging in") }

        return user;
    }
}