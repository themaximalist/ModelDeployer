import debug from "debug"
const log = debug("modeldeployer:services:chat");

import LLM from "@themaximalist/llm.js"
import Model from "../models/model.js"
import Events from "../managers/events.js"

export default async function Chat({ messages, options }, session) {
    if (!messages || messages.length == 0) { throw new Error("No messages provided") }
    if (!session) { throw new Error("No session data provided") }
    if (!session.apikey) { throw new Error("No apikey provided") }
    if (!session.apikey_model_id) { throw new Error("No model ID provided") }

    log("/api/v1/chat")

    const inputMessages = JSON.parse(JSON.stringify(messages)); // store input messages...they get modified in LLM() and we dont need it twice
    options = await parseOptions(options, session.apikey_model_id);
    const model = options.model;
    delete options.model;

    const events = new Events();
    const event = {
        options,
        messages: inputMessages,
        ModelId: session.apikey_model_id,
        APIKeyId: session.apikey,
    };

    try {
        const response_data = await LLM(messages, Object.assign({}, options, { model }));
        if (!options.stream) {
            await events.success({ ...event, response_data });
            return response_data;
        }

        return stream_response(response_data, async (final_response_data) => {
            await events.success({ ...event, response_data: final_response_data });
            return response_data;
        });


    } catch (e) {
        await events.failure({ ...event, response_data: String(e) });
        throw e;
    }
}

async function* stream_response(response, callback) {
    let buffer = "";
    for await (const data of response) {
        buffer += data;
        yield data;
    }

    callback(buffer);
}

async function parseOptions(options, apikey_model_id = null) {
    if (!apikey_model_id) { throw new Error("No model ID provided") }

    const model = await Model.findByPk(apikey_model_id);
    if (!model) throw new Error(`Invalid model ${apikey_model_id}`);

    return { ...model.options, ...options, model: model.model };
}

