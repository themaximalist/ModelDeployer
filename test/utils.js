import Database from "../src/database.js"
import Users from "../src/managers/users.js"
import User from "../src/models/user.js"

import Model from "../src/models/model.js"
import APIKey from "../src/models/apikey.js"

import assert from "assert"

export async function setupDatabase() {
    const user = await setupUser();

    const gpt = await setupGPT3(user);
    const claude = await setupClaude(user);
    const llama = await setupLlama(user);
    return { gpt, claude, llama };
}

export async function setupUser() {
    const users = new Users();
    const user = await users.add({
        email: "test@themaximalist.com",
        password1: "password",
        password2: "password"
    });

    assert(user);
    assert(user.id);

    return user;
}

export async function setupGPT3(user) {
    return await createAPIKey({
        model: "gpt-3.5-turbo-1106",
        service: "openai",
        options: {
            temperature: 0,
            max_tokens: 100,
            apikey: process.env.MODELDEPLOYER_OPENAI_API_KEY,
        },
        UserId: user.id,
    });
}

export async function setupClaude(user) {
    return await createAPIKey({
        model: "claude-2.1",
        service: "anthropic",
        options: {
            temperature: 0,
            max_tokens: 100,
            apikey: process.env.MODELDEPLOYER_ANTHROPIC_API_KEY,
        },
        UserId: user.id,
    });
}

export async function setupLlama(user) {
    return await createAPIKey({
        model: "llamafile",
        service: "llamafile",
        options: {
            temperature: 0,
            max_tokens: 100,
            input_cost: 0.01,
            output_cost: 0.01,
        },
        UserId: user.id,
    });
}

export async function createAPIKey(data) {
    const model = await Model.create(data);
    assert(model);

    const apikey = await APIKey.create({ ModelId: model.id });
    assert(apikey);

    return `modeldeployer://${apikey.id}`;
}


export async function teardownDatabase(shutdown = false) {
    const user = await User.findOne({ where: { email: "test@themaximalist.com" } });
    await user.destroy({ cascade: true });
    if (shutdown) { await Database.close() }
}