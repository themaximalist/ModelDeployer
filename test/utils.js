import Database from "../src/database.js"
import Users from "../src/managers/users.js"
import User from "../src/models/user.js"

import Model from "../src/models/model.js"
import APIKey from "../src/models/apikey.js"

import assert from "assert"

export async function setupAPIToken() {
    const users = new Users();
    const user = await users.add({
        email: "test@themaximalist.com",
        password1: "password",
        password2: "password"
    });

    assert(user);
    assert(user.id);

    const model = await Model.create({
        model: "gpt-3.5-turbo-1106",
        service: "openai",
        options: {
            temperature: 0,
            max_tokens: 100,
        },
        UserId: user.id,
    });

    assert(model);

    const apikey = await APIKey.create({
        ModelId: model.id,
    });

    assert(apikey);

    return `modeldeployer://${apikey.id}`;
}


export async function teardownDatabase(shutdown = false) {
    const user = await User.findOne({ where: { email: "test@themaximalist.com" } });
    await user.destroy({ cascade: true });
    if (shutdown) { await Database.close() }
}