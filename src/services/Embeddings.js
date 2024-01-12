import debug from "debug"
const log = debug("modeldeployer:services:Embeddings");

import Embeddings from "@themaximalist/embeddings.js"
import Model from "../models/model.js"
import Events from "../managers/events.js"
import RateLimit from "./RateLimit.js"

export default async function (data, session) {
    const { input } = data;

    if (!input || input.length == 0) { throw new Error("No input provided") }
    if (!session) { throw new Error("No session data provided") }
    if (!session.apikey) { throw new Error("No apikey provided") }
    if (!session.apikey_model_id) { throw new Error("No model ID provided") }

    log("/api/v1/embeddings")

    const options = await parseOptions(data.options, session);

    const cleanOptions = JSON.parse(JSON.stringify(options));
    delete cleanOptions.model;

    const events = new Events();
    const event = {
        options: cleanOptions,
        model: options.model,
        messages: input,
        ModelId: session.apikey_model_id,
        APIKeyId: session.apikey,
    };

    try {
        const embeddings = await Embeddings(input, options);
        await events.success({ ...event, response_data: JSON.stringify(embeddings) }, { count_response_tokens: false });
        return embeddings;
    } catch (e) {
        await events.failure({ ...event, response_data: String(e) }, { count_response_tokens: false });
        throw e;
    }
}

async function parseOptions(options, session = {}) {
    if (!session.apikey) { throw new Error("No apikey provided") }
    if (!session.apikey_model_id) { throw new Error("No model ID provided") }

    const model = await Model.findByPk(session.apikey_model_id);
    if (!model) throw new Error(`Invalid model ${session.apikey_model_id}`);

    if (await RateLimit(model, session.apikey)) {
        throw new Error("Rate limit exceeded");
    }

    return Object.assign({}, model.options, options, { model: model.model, service: model.service });
}
