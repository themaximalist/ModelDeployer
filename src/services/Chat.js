import debug from "debug"
const log = debug("modeldeployer:services:chat");

import LLM from "@themaximalist/llm.js"
import Model from "../models/model.js"
import Event from "../models/event.js"
import APIKey from "../models/apikey.js";


export default async function Chat({ messages, options }, session) {
    if (!messages || messages.length == 0) { throw new Error("No messages provided") }
    if (!session) { throw new Error("No session data provided") }
    if (!session.apikey) { throw new Error("No apikey provided") }
    if (!session.apikey_model_id) { throw new Error("No model ID provided") }

    log("/api/v1/chat")

    const inputMessages = JSON.parse(JSON.stringify(messages)); // store input messages...they get modified in LLM() and we dont need it twice
    options = await parseOptions(options, session.apikey_model_id);

    try {
        const response_data = await LLM(messages, options);

        delete options.model; // don't need it

        await Event.create({
            options,
            messages: inputMessages,
            response_data,
            response_code: 200,
            ModelId: session.apikey_model_id,
            APIKeyId: session.apikey,
        });

        return response_data;
    } catch (e) {
        await Event.create({
            options,
            messages: inputMessages,
            response_data: e.message,
            response_code: 500,
            ModelId: session.apikey_model_id,
            APIKeyId: session.apikey,
        });

        throw e;
    }
}

async function parseOptions(options, apikey_model_id = null) {
    if (!apikey_model_id) { throw new Error("No model ID provided") }

    const model = await Model.findByPk(apikey_model_id);
    if (!model) throw new Error(`Invalid model ${apikey_model_id}`);

    return { ...model.options, ...options, model: model.model };
}

